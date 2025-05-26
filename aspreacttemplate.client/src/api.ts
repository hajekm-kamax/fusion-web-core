import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config as any;
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;
            if (!refreshPromise) {
                refreshPromise = axios.post('/api/auth/refresh', null, { withCredentials: true })
                    .finally(() => { refreshPromise = null; });
            }
            await refreshPromise;
            return api(original);
        }
        return Promise.reject(err);
    });

export { api };
