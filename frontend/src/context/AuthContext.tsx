import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (emailOrPhone: string, role: UserRole) => Promise<void>;
  register: (data: Partial<User>, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    const savedToken = authService.getToken();
    if (savedUser && savedToken) {
      setState({
        user: savedUser,
        token: savedToken,
        role: savedUser.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (emailOrPhone: string, role: UserRole) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { user, token } = await authService.login(emailOrPhone, role);
      setState({
        user,
        token,
        role: user.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (data: Partial<User>, role: UserRole) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { user, token } = await authService.register(data, role);
      setState({
        user,
        token,
        role: user.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
