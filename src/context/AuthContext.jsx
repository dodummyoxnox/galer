import { createContext, useContext, useState, useEffect } from 'react';
import { request } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on app start/mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const result = await request('/api/auth/status');
        if (result.isAuthenticated) {
          setAdmin(result.admin);
        }
      } catch (error) {
        console.warn('Gagal memverifikasi status auth:', error.message);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await request('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      if (result.success) {
        setAdmin(result.admin);
        return { success: true };
      }
      return { success: false, error: 'Email atau password salah.' };
    } catch (error) {
      return { success: false, error: error.message || 'Koneksi gagal ke server.' };
    }
  };

  const logout = async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Gagal logout di server:', error.message);
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
