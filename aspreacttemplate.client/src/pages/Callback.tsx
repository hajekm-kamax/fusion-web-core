import { useEffect } from 'react';
import { handleCallback } from '../auth/authService';

export default function Callback() {
    useEffect(() => {
        handleCallback().then(() => {
            window.location.href = '/';
        });
    }, []);

    return <p>Signing in...</p>;
}
