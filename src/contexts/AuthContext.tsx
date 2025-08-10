import React, { createContext, useContext, useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { authApi } from '../api/auth';
import type { User, LoginRequest, RegisterRequest, ChangePasswordRequest, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authEnabled, setAuthEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AUTH] Initializing authentication...');
        // Check authentication status from backend
        const status = await authApi.getStatus();
        console.log('[AUTH] Status response:', status);
        setAuthEnabled(status.authEnabled);

        // If auth is disabled, set up mock user
        if (!status.authEnabled) {
          console.log('[AUTH] Authentication disabled, setting up mock user');
          const mockUser = { id: 1, email: 'dev@example.com', username: 'dev' };
          setUser(mockUser);
          setToken('mock-token');
          setIsInitialized(true);
          return;
        }

        // If auth is enabled, check for existing session
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          try {
            console.log('[AUTH] Verifying existing token...');
            // Verify token is still valid
            const profile = await authApi.getProfile();
            setUser(profile);
            setToken(storedToken);
            console.log('[AUTH] Token verified, user logged in');
          } catch (error) {
            console.log('[AUTH] Token invalid, clearing stored data');
            // Token invalid, clear stored data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        }
      } catch (error) {
        console.error('[AUTH] Failed to initialize auth:', error);
        // Fallback: assume auth is enabled and proceed without auto-login
        console.log('[AUTH] Using fallback: assuming auth is enabled');
        setAuthEnabled(true);
      } finally {
        console.log('[AUTH] Initialization complete');
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      
      setUser(response.user);
      setToken(response.access_token);
      
      if (authEnabled) {
        localStorage.setItem('auth_token', response.access_token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }

      notifications.show({
        title: 'Welcome back!',
        message: `Hi ${response.user.username}, you're now logged in.`,
        color: 'green',
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      notifications.show({
        title: 'Login Failed',
        message,
        color: 'red',
      });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const newUser = await authApi.register(userData);
      
      notifications.show({
        title: 'Registration Successful',
        message: 'Account created! You can now login.',
        color: 'green',
      });

      return newUser;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      notifications.show({
        title: 'Registration Failed',
        message,
        color: 'red',
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    notifications.show({
      title: 'Goodbye!',
      message: 'You have been logged out.',
      color: 'blue',
    });
  };

  const changePassword = async (passwords: ChangePasswordRequest) => {
    try {
      await authApi.changePassword(passwords);
      
      notifications.show({
        title: 'Success',
        message: 'Your password has been changed.',
        color: 'green',
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password.';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const status = await authApi.getStatus();
      setAuthEnabled(status.authEnabled);
      
      // If auth was enabled but is now disabled, set up mock user
      if (!status.authEnabled && authEnabled) {
        const mockUser = { id: 1, email: 'dev@example.com', username: 'dev' };
        setUser(mockUser);
        setToken('mock-token');
      }
      
      // If auth was disabled but is now enabled, clear mock user
      if (status.authEnabled && !authEnabled) {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    authEnabled,
    login,
    register,
    logout,
    changePassword,
    checkAuthStatus,
  };

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
