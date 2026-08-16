import axios from 'axios';
import { BASE_URL } from './config';
import { authBridge } from './authBridge';

export const api = axios.create({ baseURL: BASE_URL });

export const SESSION_EXPIRED = 'SESSION_EXPIRED';

let refreshPromise: Promise<any> | null = null;

const runRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = authBridge.refresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

api.interceptors.request.use(async config => {
  let { token, tokenExpiresAt } = authBridge.getAuth();

  if (token && tokenExpiresAt && Date.now() > tokenExpiresAt - 60_000) {
    try {
      const data = await runRefresh();
      token = data.access_token;
    } catch {
      authBridge.logout();
      throw new axios.Cancel(SESSION_EXPIRED);
    }
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    const isRefreshCall = original?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !original?._retry && !isRefreshCall) {
      original._retry = true;
      try {
        const data = await runRefresh();
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch {
        authBridge.logout();
        return Promise.reject(new axios.Cancel(SESSION_EXPIRED));
      }
    }
    return Promise.reject(error);
  },
);
