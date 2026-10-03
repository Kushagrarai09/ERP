export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');
const TOKEN_KEY = 'erp_access_token';

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const token = auth.getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(`Unable to reach the ERP API at ${API_URL}. Start the backend and verify PostgreSQL is configured.`, 0);
  }
  if (response.status === 401) {
    auth.clear();
    window.dispatchEvent(new Event('erp:unauthorized'));
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => undefined);
    throw new ApiError(payload?.error?.message || 'Request failed', response.status, payload?.error?.details);
  }
  if (response.status === 204) return undefined as T;
  const payload = await response.json();
  return payload.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
  login: async (email: string, password: string) => {
    const result = await request<{ token: string; user: unknown }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    auth.setToken(result.token);
    return result;
  },
  signup: async (body: { organizationName: string; organizationEmail: string; name: string; email: string; password: string }) => {
    const result = await request<{ token: string; user: unknown }>('/auth/signup', { method: 'POST', body: JSON.stringify(body) });
    auth.setToken(result.token);
    return result;
  },
};