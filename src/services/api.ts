import { store } from '../redux/store';
import type { RootState, AppDispatch } from '../redux/store';
import { refreshAccessToken, logout } from '../redux/slices/auth/authSlice';

const BASE_URL = 'https://voita-backend.fly.dev/api/v1';

export function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined | null>,
): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Unknown error' }));

    let message: string;
    if (Array.isArray(error.detail)) {
      // FastAPI validation errors: [{ loc, msg, type }, ...]
      message = error.detail
        .map((d: any) => d?.msg ?? JSON.stringify(d))
        .join('; ');
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    } else {
      message = `Request failed: ${response.status}`;
    }

    const err = new Error(message);
    (err as any).status = response.status;
    throw err;
  }

  return response.json() as Promise<T>;
}

export async function apiFetchAuth<T>(
  url: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  return apiFetch<T>(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}

// Shared extractor for RTK thunk errors
export function extractError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

// AUTHORIZED FETCH — auto refresh + retry on 401

let refreshPromise: Promise<string | null> | null = null;

async function ensureFreshToken(forceRefresh = false): Promise<string | null> {
  const state: RootState = store.getState();
  const { token, tokenExpiresAt } = state.auth;

  if (!token) return null;

  const stillValid =
    !forceRefresh && tokenExpiresAt && Date.now() < tokenExpiresAt - 60_000;
  if (stillValid) return token;

  if (!refreshPromise) {
    const dispatch: AppDispatch = store.dispatch;
    refreshPromise = dispatch(refreshAccessToken())
      .unwrap()
      .then(res => res.access_token as string)
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function authorizedFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const token = await ensureFreshToken();

  if (!token) {
    store.dispatch(logout());
    throw new Error('Not authenticated');
  }

  try {
    return await apiFetchAuth<T>(url, token, options);
  } catch (err: any) {
    if (err.status === 401) {
      const newToken = await ensureFreshToken(true); // force refresh, bypass expiry check
      if (!newToken) {
        store.dispatch(logout());
        throw err;
      }
      return apiFetchAuth<T>(url, newToken, options);
    }
    throw err;
  }
}
