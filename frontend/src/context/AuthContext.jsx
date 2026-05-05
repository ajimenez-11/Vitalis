import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, logout as logoutApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    const saved = localStorage.getItem('vitalis_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vitalis_token'));

  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem('vitalis_token', data.token);
    localStorage.setItem('vitalis_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try { await logoutApi(); } catch (_) {}
    localStorage.removeItem('vitalis_token');
    localStorage.removeItem('vitalis_user');
    setToken(null);
    setUser(null);
  };

  // Helpers de rol
  const isAdmin    = user?.rol === 'admin';
  const isResponsable = user?.rol === 'responsable_cuina';
  const isCuiner   = user?.rol === 'cuiner';
  // pot crear/editar/eliminar
  const canWrite   = isAdmin || isResponsable; 

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isResponsable, isCuiner, canWrite }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);