using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Mvc;

namespace AspReactTemplate.Server.Controllers
{
    [Route("Authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthenticationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("login")]
        public IActionResult Login(string? returnUrl = "/")
        {
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = returnUrl
            }, OpenIdConnectDefaults.AuthenticationScheme);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded || authenticateResult.Principal == null)
            {
                return Unauthorized("Login failed.");
            }

            var oidcUser = authenticateResult.Principal;

            var claims = new List<Claim>(oidcUser.Claims)
            {
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim("role", "Admin")
            };

            var enrichedIdentity = new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            var principal = new ClaimsPrincipal(enrichedIdentity);

            // This replaces the cookie identity with your enriched one
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            Console.WriteLine("LAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLL");

            return Redirect("http://localhost:3000");
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            var idToken = await HttpContext.GetTokenAsync("id_token");

            var authority = _configuration["Authentication:Authority"];

            var postLogoutRedirectUri = Url.ActionLink(
                action: "PostLogout",
                controller: "Authentication"
            );

            var logoutUri = $"{authority}/connect/logout";

            var parameters = new Dictionary<string, string>
            {
                ["post_logout_redirect_uri"] = postLogoutRedirectUri!
            };

            if (!string.IsNullOrEmpty(idToken))
            {
                parameters["id_token_hint"] = idToken;
            }

            var query = string.Join("&", parameters.Select(p =>
                $"{p.Key}={Uri.EscapeDataString(p.Value)}"));

            return Redirect($"{logoutUri}?{query}");
        }

        [HttpGet("post-logout")]
        public async Task<IActionResult> PostLogout([FromQuery] string? logoutConfirmed, [FromQuery] string? returnUrl = "/")
        {
            if (logoutConfirmed == "true")
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                Response.Cookies.Delete("app_access");
            }

            return Redirect(returnUrl ?? "/");
        }

        [HttpGet("me")]
        public IActionResult Me()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Unauthorized();

            return Ok(new
            {
                Name = User.Identity.Name,
                Claims = User.Claims.Select(c => new { c.Type, c.Value })
            });
        }
    }
}
