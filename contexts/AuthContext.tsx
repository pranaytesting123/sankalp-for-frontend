import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiService } from '@/services/api';
import { API_BASE_URL } from '@/utils/constants';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string; requiresOTP?: boolean }>;
  register: (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string; requiresOTP?: boolean }>;
  verifyOTP: (otp: string, email: string) => Promise<{ success: boolean; message?: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string, otp: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await SecureStore.getItemAsync(AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Stored auth loaded:', parsed);
        if (parsed?.token && parsed?.user) {
          setToken(parsed.token);
          setUser(parsed.user);
          apiService.setAuthToken(parsed.token);
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuth = async (authToken: string, userData: User, remember: boolean = true) => {
    try {
      const authObject = {
        token: authToken,
        user: userData,
        remember,
      };
      await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(authObject));
    } catch (error) {
      console.error('Error storing auth:', error);
    }
  };

  const clearAuth = async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_KEY);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const response = await apiService.post('/api/login', { email, password });

      if (response.success) {
        if (response.requiresOTP) {
          return { success: true, requiresOTP: true, message: response.message };
        }

        const { token: authToken, user: userData } = response.data;
        console.log('Login successful: from authcontexts', response);
        setToken(authToken);
        setUser(userData);
        apiService.setAuthToken(authToken);
        await storeAuth(authToken, userData, rememberMe);

        return { success: true , message: response.message };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      const payload = {
        name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password
      };

      const response = await apiService.post('/api/register', payload);

      if (response.success) {
        return { success: true, requiresOTP: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const verifyOTP = async (otp: string, email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp, email }),
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        const text = await response.text();
        console.error('Unexpected (non-JSON) response from verify-otp:', text);
        return { success: false, message: 'Unexpected server response' };
      }
    } catch (error) {
      console.error('Error during verifyOTP:', error);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };

  const resendOTP = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        const text = await response.text();
        console.error('Unexpected (non-JSON) response from resend-otp:', text);
        return { success: false, message: 'Unexpected server response' };
      }
    } catch (error) {
      console.error('Error during resendOTP:', error);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await apiService.post('/api/forgot-password', { email });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Request password reset error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP.',
      };
    }
  };

  const resetPassword = async (email: string, otp: string, password: string) => {
    try {
      const response = await apiService.post('/api/reset-password', {
        email,
        otp,
        password,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed.',
      };
    }
  };

  const logout = async () => {
    try {
      await apiService.post('/auth', {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      setToken(null);
      apiService.setAuthToken(null);
      await clearAuth();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    requestPasswordReset,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
