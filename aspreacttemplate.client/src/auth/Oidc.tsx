import { AuthProvider, useAuth } from 'react-oidc-context';
import { oidcConfig } from './oidcConfig';
import type { JSX } from 'react';

export const OidcProvider: React.FC<{ children: React.ReactNode }> =
    ({ children }) => <AuthProvider {...oidcConfig}>{children}</AuthProvider>;

export const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { user, isLoading, signIn } = useAuth();
    if (isLoading) return null;
    if (!user) { signIn(); return null; }
    return children;
};
