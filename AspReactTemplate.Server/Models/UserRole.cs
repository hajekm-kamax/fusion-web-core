using System.ComponentModel.DataAnnotations;

namespace AspReactTemplate.Server.Models
{
    public class UserRole
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; } = "";
        public int RoleId { get; set; }
        public Role Role { get; set; } = default!;
    }
}
