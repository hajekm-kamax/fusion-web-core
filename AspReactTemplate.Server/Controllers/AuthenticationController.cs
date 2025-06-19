using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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

            // You can also enrich the claims with data from your DB here.
            var jwt = CreateJwtForUser(oidcUser);

            // Store access token in secure cookie
            Response.Cookies.Append("app_access", jwt, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddMinutes(30)
            });

            // Optional: redirect back to your SPA
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
                ["post_logout_redirect_uri"] = postLogoutRedirectUri
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
                Response.Cookies.Delete("app_access"); // if you're using access cookie
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

        private string CreateJwtForUser(ClaimsPrincipal user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.Identity?.Name ?? "unknown"),
            new Claim("role", "user") // replace or enrich with DB claims
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
