export const login = () => window.location.href = "auth/login";

export const logout = async () => {
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
};

// utility fetch that auto-refreshes on 401 (simplified)
export async function api<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
    const r = await fetch(input, { ...init, credentials: "include" });
    if (r.status === 401) {
        // try silent refresh then retry once
        const refresh = await fetch("/auth/refresh", { method: "POST", credentials: "include" });
        if (refresh.ok) return api<T>(input, init);
        login();                       // session really dead
        throw new Error("redirecting");
    }
    if (!r.ok) throw new Error(await r.text());
    return r.json() as Promise<T>;
}
