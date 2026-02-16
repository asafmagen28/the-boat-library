import { createContext, useContext, useState, useCallback } from 'react';
import { ROLES } from '../constants/roles';

const AuthContext = createContext(null);

const FAKE_USER = {
  id: 1,
  username: 'dev_user',
  roleId: ROLES.EMPLOYEE,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(FAKE_USER);

  const switchRole = useCallback((role) => {
    setUser((prev) => (prev ? { ...prev, roleId: role } : prev));
  }, []);

  // Stubs for Phase 3 — will be replaced with real JWT logic
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, switchRole, login, logout }}>
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
