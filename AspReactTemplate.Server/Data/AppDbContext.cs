using AspReactTemplate.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AspReactTemplate.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> o) : base(o) { }

        public DbSet<Role> Roles => Set<Role>();
        public DbSet<UserRole> UserRoles => Set<UserRole>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    }
}
