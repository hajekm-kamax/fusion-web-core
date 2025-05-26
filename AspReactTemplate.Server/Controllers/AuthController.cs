using AspReactTemplate.Server.Data;
using AspReactTemplate.Server.Models;
using AspReactTemplate.Server.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspReactTemplate.Server.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _cfg;
        public AuthController(AppDbContext db, IConfiguration cfg) { _db = db; _cfg = cfg; }

        [HttpPost("api/auth/refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("app_refresh", out var rt)) return Unauthorized();

            var sha = TokenService.Hash(rt);
            var row = await _db.RefreshTokens.SingleOrDefaultAsync(t => t.TokenSha == sha);
            if (row is null || row.Revoked != null || row.Expires < DateTime.UtcNow)
                return Unauthorized();

            // rotate
            row.Revoked = DateTime.UtcNow;
            var roles = _db.UserRoles.Where(r => r.UserId == row.UserId).Select(r => r.Role.Name).ToList();
            var (at, newRt) = TokenService.CreateTokens(row.UserId, roles, _cfg);

            _db.RefreshTokens.Add(new RefreshToken
            {
                TokenSha = TokenService.Hash(newRt),
                UserId = row.UserId,
                Expires = DateTime.UtcNow.AddDays(14),
                ReplacedBy = row.Id
            });
            await _db.SaveChangesAsync();

            Response.Cookies.Append("app_access", at, CookieOpts(15));
            Response.Cookies.Append("app_refresh", newRt, CookieOpts(days: 14));
            return NoContent();
        }

        [HttpPost("api/auth/logout")]
        public async Task<IActionResult> Logout()
        {
            if (Request.Cookies.TryGetValue("app_refresh", out var rt))
            {
                var row = await _db.RefreshTokens.SingleOrDefaultAsync(t => t.TokenSha == TokenService.Hash(rt));
                if (row != null) row.Revoked = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
            Response.Cookies.Delete("app_access");
            Response.Cookies.Delete("app_refresh");
            await HttpContext.SignOutAsync();
            return NoContent();
        }

        private static CookieOptions CookieOpts(int minutes = 0, int days = 0) =>
            new()
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = days > 0 ? DateTimeOffset.UtcNow.AddDays(days)
                                    : DateTimeOffset.UtcNow.AddMinutes(minutes)
            };
    }
}
