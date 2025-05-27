using Microsoft.Extensions.Caching.Memory;

namespace AspReactTemplate.Server.Auth
{
    public sealed class InMemoryRefreshStore(IMemoryCache cache) : IRefreshStore
    {
        private readonly IMemoryCache _c = cache;

        public Task SaveAsync(string sub, string handle, DateTimeOffset exp)
        {
            _c.Set(GetKey(sub), handle, exp);
            return Task.CompletedTask;
        }

        public Task<bool> TryRotateAsync(string sub, string oldHandle, string newHandle, DateTimeOffset exp)
        {
            var key = GetKey(sub);
            if (!_c.TryGetValue<string>(key, out var existing) || existing != oldHandle)
                return Task.FromResult(false);

            _c.Set(key, newHandle, exp);
            return Task.FromResult(true);
        }

        public Task RevokeAsync(string sub)
        {
            _c.Remove(GetKey(sub));
            return Task.CompletedTask;
        }

        private static string GetKey(string sub) => $"rt:{sub}";
    }
}
