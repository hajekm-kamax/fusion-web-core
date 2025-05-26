using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace AspReactTemplate.Server.Services
{
    public class TokenService
    {
        // ----- make Access- & Refresh-tokens -----
        public static (string access, string refresh) CreateTokens(
            string userId, IEnumerable<string> roles, IConfiguration cfg)
        {
            // ----- ACCESS JWT (15 min) -----
            var key = new SymmetricSecurityKey(
                Convert.FromBase64String(cfg["Jwt:SigningKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim> {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var jwt = new JwtSecurityToken(
                issuer: cfg["Jwt:Issuer"],
                audience: cfg["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds);

            string access = new JwtSecurityTokenHandler().WriteToken(jwt);

            // ----- REFRESH string (random, 14 days) -----
            string refresh = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)); // 256-bit
            return (access, refresh);
        }

        // ----- hash refresh string before DB -----
        public static string Hash(string token, string pepper = "SuperPepper") =>
            Convert.ToHexString(
                SHA512.HashData(Encoding.UTF8.GetBytes(token + pepper)));
    }
}
