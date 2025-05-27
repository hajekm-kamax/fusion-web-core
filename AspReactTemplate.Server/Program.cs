using System.Security.Claims;
using AspReactTemplate.Server.Auth;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------
// Core services
// --------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();                       // used by AuthController

// --------------------------------------------------
// Authentication & authorisation
// --------------------------------------------------
var oidc = builder.Configuration.GetSection("Oidc");

builder.Services
    .AddMemoryCache()
    .AddSingleton<IRefreshStore, InMemoryRefreshStore>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieNames.Access;               // short-lived
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie(CookieNames.Access, o =>
{
    o.Cookie.Name = CookieNames.Access;
    o.Cookie.HttpOnly = true;
    o.Cookie.SameSite = SameSiteMode.Strict;
    o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    o.ExpireTimeSpan = TimeSpan.FromMinutes(10);
})
.AddCookie(CookieNames.Refresh, o =>
{
    o.Cookie.Name = CookieNames.Refresh;                           // issued manually
    o.Cookie.HttpOnly = true;
    o.Cookie.SameSite = SameSiteMode.Strict;
    o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
})
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, o =>
{
    o.Authority = oidc["Authority"];
    o.ClientId = oidc["ClientId"];
    o.ClientSecret = oidc["ClientSecret"];
    o.ResponseType = OpenIdConnectResponseType.Code;
    o.UsePkce = true;
    o.CallbackPath = "/auth/callback-login";
    o.SignedOutCallbackPath = "/auth/callback-logout";

    o.Scope.Clear();
    foreach (var s in oidc.GetSection("Scopes").Get<string[]>())
        o.Scope.Add(s);

    // we don’t persist raw tokens to the auth-cookie
    o.SaveTokens = false;
    o.Events = new OpenIdConnectEvents
    {
        OnTokenValidated = async ctx =>
        {
            var sub = ctx.Principal!.FindFirstValue("sub")!;
            var tokens = ctx.TokenEndpointResponse!;                   // contains refresh_token
            var store = ctx.HttpContext.RequestServices.GetRequiredService<IRefreshStore>();

            await store.SaveAsync(sub, tokens.RefreshToken!, DateTimeOffset.UtcNow.AddHours(8));

            // issue refresh cookie
            ctx.HttpContext.Response.Cookies.Append(
                CookieNames.Refresh,
                tokens.RefreshToken!,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(8)
                });
        }
    };
});

builder.Services.AddAuthorization();

// --------------------------------------------------
// Pipeline
// --------------------------------------------------
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();                                    // includes AuthController
app.MapFallbackToFile("/index.html");

app.Run();
