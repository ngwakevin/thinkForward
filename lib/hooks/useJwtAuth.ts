'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, setAuthToken, removeAuthToken, refreshAccessToken, isTokenExpired } from '@/lib/auth-tokens';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getUserInfo: () => any | null;
}

/**
 * Custom hook for JWT authentication
 */
export function useJwtAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        // Try to refresh the token
        const newToken = await refreshAccessToken();
        setIsAuthenticated(!!newToken);
      } else {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }
      
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Call logout endpoint to clear cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear local storage
      removeAuthToken();
      setIsAuthenticated(false);
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user info from token
  const getUserInfo = useCallback((): any | null => {
    const token = getAuthToken();
    
    if (!token) return null;
    
    try {
      // Decode JWT token (payload is in the second part after splitting by dot)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getUserInfo,
  };
}