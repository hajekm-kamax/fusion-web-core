namespace AspReactTemplate.Server.Auth
{
    public interface IRefreshStore
    {
        Task SaveAsync(string sub, string handle, DateTimeOffset expires);
        Task<bool> TryRotateAsync(string sub, string oldHandle, string newHandle, DateTimeOffset newExp);
        Task RevokeAsync(string sub);
    }
}
