/*
export const oidcConfig = {
    authority: import.meta.env.VITE_OIDC_AUTHORITY,
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: 'code',
    scope: 'openid profile email offline_access',
    automaticSilentRenew: true,
    loadUserInfo: false
};
*/
// src/auth/oidcConfig.ts
export const oidcConfig = {
    authority: "https://kxcztuin002:643",           // keep the real issuer
    client_id: "asp-react-template",
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: "code",
    scope: "openid profile email offline_access",

    // NEW: override where it fetches metadata
    metadataUrl: `https://localhost:7174/oidc/discovery`
};
