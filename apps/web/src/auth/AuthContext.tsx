import { createContext, useContext, useEffect, useState } from 'react';
import { api, auth } from '../lib/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  organization?: { id: string; name: string; email: string };
}
interface AuthContextValue { user: AuthUser | null; loading: boolean; error: string | null; login: (email: string, password: string) => Promise<void>; signup: (details: { organizationName: string; organizationEmail: string; name: string; email: string; password: string }) => Promise<void>; logout: () => void; }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(Boolean(auth.getToken()));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('erp:unauthorized', handleUnauthorized);
    if (auth.getToken()) {
      api.get<AuthUser>('/auth/me').then(setUser).catch(() => auth.clear()).finally(() => setLoading(false));
    }
    return () => window.removeEventListener('erp:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true); setError(null);
    try { const result = await api.login(email, password); setUser(result.user as AuthUser); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to sign in'); throw caught; }
    finally { setLoading(false); }
  };
  const logout = () => { auth.clear(); setUser(null); };
  const signup = async (details: { organizationName: string; organizationEmail: string; name: string; email: string; password: string }) => { setLoading(true); setError(null); try { const result = await api.signup(details); setUser(result.user as AuthUser); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to create account'); throw caught; } finally { setLoading(false); } };
  return <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};