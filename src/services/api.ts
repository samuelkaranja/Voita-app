import { api } from '../api/client';
import { extractError } from '../api/errors';

// Re-export the central extractError so imported functions in service slices work seamlessly
export { extractError };

/**
 * Helper to append query parameters to a path.
 * Since `api` (axios) handles BASE_URL, this returns a relative path string.
 */
export function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined | null>,
): string {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Replaces native `fetch` with Axios `api.request`.
 * Routes all standard requests through `api/client.ts`.
 */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await api.request<T>({
    url,
    method: options?.method || 'GET',
    data: options?.body ? JSON.parse(options.body as string) : undefined,
    headers: options?.headers as any,
  });
  return res.data;
}

/**
 * The Bearer token is now injected automatically by `api/client.ts` interceptors.
 * We keep the `token` parameter for backwards compatibility, but ignore it.
 */
export async function apiFetchAuth<T>(
  url: string,
  _token?: string,
  options?: RequestInit,
): Promise<T> {
  return apiFetch<T>(url, options);
}

/**
 * Token checks, proactive refresh, 401 retries, and logout on session expiration
 * are now completely handled centrally by `api/client.ts`.
 */
export async function authorizedFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  return apiFetch<T>(url, options);
}
