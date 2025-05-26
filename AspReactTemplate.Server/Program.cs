using System.Security.Claims;
using AspReactTemplate.Server.Data;
using AspReactTemplate.Server.Models;
using AspReactTemplate.Server.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var cfg = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("MyApp"));

builder.Services
    .AddAuthentication(o =>
    {
        o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        o.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
    })
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, c =>
    {
        c.Cookie.Name = "myapp_auth";
        c.SlidingExpiration = true;
    })
    .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, o =>
    {
        o.Authority = cfg["Oidc:Authority"];
        o.ClientId = cfg["Oidc:ClientId"];
        o.ClientSecret = cfg["Oidc:ClientSecret"];
        o.ResponseType = "code";
        o.UsePkce = true;
        o.Scope.Add("offline_access");
        o.SaveTokens = true;

        o.Events = new OpenIdConnectEvents
        {
            OnTokenValidated = async ctx =>
            {
                var db = ctx.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                string uid = ctx.Principal!.FindFirst(ClaimTypes.NameIdentifier)!.Value;

                var roles = db.UserRoles
                              .Where(r => r.UserId == uid)
                              .Select(r => r.Role.Name)
                              .ToList();

                var extra = new ClaimsIdentity();
                roles.ForEach(r => extra.AddClaim(new Claim(ClaimTypes.Role, r)));
                ctx.Principal.AddIdentity(extra);

                var (at, rt) = TokenService.CreateTokens(uid, roles, cfg);

                ctx.Response.Cookies.Append("app_access", at, CookieOpts(15));
                ctx.Response.Cookies.Append("app_refresh", rt, CookieOpts(days: 14));

                db.RefreshTokens.Add(new RefreshToken
                {
                    TokenSha = TokenService.Hash(rt),
                    UserId = uid,
                    Expires = DateTime.UtcNow.AddDays(14)
                });
                await db.SaveChangesAsync();
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// --- seed demo data each run ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Roles.AddRange(new Role { Id = 1, Name = "Admin" }, new Role { Id = 2, Name = "User" });
    db.UserRoles.Add(new UserRole { UserId = "alice", RoleId = 1 });
    db.SaveChanges();
}


app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

static CookieOptions CookieOpts(int minutes = 0, int days = 0) =>
    new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = days > 0 ? DateTimeOffset.UtcNow.AddDays(days)
                            : DateTimeOffset.UtcNow.AddMinutes(minutes)
    };