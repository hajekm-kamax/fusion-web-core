using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;
using AspReactTemplate.Server.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace AspReactTemplate.Server.Controllers
{
    [ApiController]
    [Route("auth")]
    public sealed class AuthController : ControllerBase
    {
        private readonly IRefreshStore _store;
        private readonly IConfiguration _cfg;
        private readonly IHttpClientFactory _http;

        public AuthController(IRefreshStore store, IConfiguration cfg, IHttpClientFactory http)
        {
            _store = store;
            _cfg = cfg;
            _http = http;
        }

        [HttpGet("login")]
        public IActionResult Login(string returnUrl = "/")
        {
            var props = new AuthenticationProperties { RedirectUri = returnUrl };
            return Challenge(props, OpenIdConnectDefaults.AuthenticationScheme);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var sub = User.FindFirstValue("sub");
            if (sub is not null)
                await _store.RevokeAsync(sub);

            await HttpContext.SignOutAsync(CookieNames.Access);
            Response.Cookies.Delete(CookieNames.Refresh);

            return NoContent();
        }

        [Authorize]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var currentRefresh = Request.Cookies[CookieNames.Refresh];
            var sub = User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(currentRefresh) || string.IsNullOrEmpty(sub))
                return Unauthorized();

            var client = _http.CreateClient();

            var docRetriever = new HttpDocumentRetriever(client)
            {
                RequireHttps = _cfg["Oidc:Authority"].StartsWith("https", StringComparison.OrdinalIgnoreCase)
            };

            var configManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                $"{_cfg["Oidc:Authority"]}/.well-known/openid-configuration",
                new OpenIdConnectConfigurationRetriever(),
                docRetriever);

            var disco = await configManager.GetConfigurationAsync(HttpContext.RequestAborted);
            var tokenEndpoint = disco.TokenEndpoint;

            // ------------------ call token endpoint -----------------------
            using var req = new HttpRequestMessage(HttpMethod.Post, tokenEndpoint)
            {
                Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["grant_type"] = "refresh_token",
                    ["client_id"] = _cfg["Oidc:ClientId"],
                    ["client_secret"] = _cfg["Oidc:ClientSecret"],
                    ["refresh_token"] = currentRefresh
                })
            };
            req.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            using var resp = await client.SendAsync(req, HttpCompletionOption.ResponseHeadersRead);
            if (!resp.IsSuccessStatusCode) return Unauthorized();

            using var json = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());
            var newRefresh = json.RootElement.GetProperty("refresh_token").GetString();
            if (string.IsNullOrEmpty(newRefresh)) return Unauthorized();

            // rotate in server-side store
            var rotated = await _store.TryRotateAsync(
                sub, currentRefresh!, newRefresh!, DateTimeOffset.UtcNow.AddHours(8));

            if (!rotated) return Unauthorized();

            // renew short-lived access cookie (just re-sign the existing claims)
            var identity = new ClaimsIdentity(User.Claims, CookieNames.Access);
            await HttpContext.SignInAsync(CookieNames.Access, new ClaimsPrincipal(identity));

            // issue new refresh cookie
            Response.Cookies.Append(
                CookieNames.Refresh,
                newRefresh!,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(8)
                });

            return NoContent();
        }
    }
}
