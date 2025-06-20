// src/api/http.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

// Perform the actual request
async function request<TResponse>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: any,
    retry = true
): Promise<TResponse> {
    const response = await fetch(url, {
        method,
        credentials: "include", // critical for sending cookies
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && retry) {
        // You can later retry here after implementing refresh token
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
    }

    return response.json();
}

// REST helpers
export const http = {
    get: <T>(url: string) => request<T>("GET", url),
    post: <T>(url: string, body: any) => request<T>("POST", url, body),
    put: <T>(url: string, body: any) => request<T>("PUT", url, body),
    delete: <T>(url: string) => request<T>("DELETE", url),
    raw: request,
};
