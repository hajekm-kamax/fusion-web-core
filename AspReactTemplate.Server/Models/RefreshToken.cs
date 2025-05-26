namespace AspReactTemplate.Server.Models
{
    public class RefreshToken
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string TokenSha { get; init; } = "";   // SHA-512(token|pepper)
        public string UserId { get; init; } = "";
        public DateTime Expires { get; init; }
        public DateTime? Revoked { get; set; }
        public Guid? ReplacedBy { get; set; }
    }
}
