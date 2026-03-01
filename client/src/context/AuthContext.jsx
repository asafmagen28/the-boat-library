import { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return { id: payload.id, username: payload.username, roleId: payload.roleId };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (!decoded) localStorage.removeItem('token');
      return decoded;
    }
    return null;
  });

  const login = useCallback(async (username, password) => {
    const { data } = await authAPI.login(username, password);
    localStorage.setItem('token', data.token);
    setUser(decodeToken(data.token));
  }, []);

  const loginWithToken = useCallback((token) => {
    localStorage.setItem('token', token);
    setUser(decodeToken(token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
