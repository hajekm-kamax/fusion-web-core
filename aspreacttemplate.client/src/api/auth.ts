export interface UserInfo {
    name: string;
    claims: {
        type: string;
        value: string;
    }[];
}

export const login = () => {
    window.location.href = "/Authentication/login";
};

export const logout = async (): Promise<void> => {
    await fetch("/Authentication/logout", {
        method: "POST",
        credentials: "include",
    });
    window.location.href = "/";
};

export const getMe = async (): Promise<UserInfo> => {
    const response = await fetch("/Authentication/me", {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Not authenticated");
    }

    return response.json();
};
