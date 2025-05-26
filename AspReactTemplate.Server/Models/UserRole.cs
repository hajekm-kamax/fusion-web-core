namespace AspReactTemplate.Server.Models
{
    public class UserRole
    {
        public string UserId { get; set; } = "";
        public int RoleId { get; set; }
        public Role Role { get; set; } = default!;
    }
}
