import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = sessionStorage.getItem('admin');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Mock auth — replace with API call
    if (email === 'admin@studio.com' && password === 'admin123') {
      const user = { email, nama: 'Admin Studio' };
      setAdmin(user);
      sessionStorage.setItem('admin', JSON.stringify(user));
      return { success: true };
    }
    return { success: false, error: 'Email atau password salah.' };
  };

  const logout = () => {
    setAdmin(null);
    sessionStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
