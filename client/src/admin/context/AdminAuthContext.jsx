import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Ensure cookies are always sent with credentials across all requests
axios.defaults.withCredentials = true;

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  // Update axios default header whenever CSRF token changes
  const applyCsrfToken = useCallback((token) => {
    if (token) {
      setCsrfToken(token);
      axios.defaults.headers.common['x-csrf-token'] = token;
    } else {
      setCsrfToken('');
      delete axios.defaults.headers.common['x-csrf-token'];
    }
  }, []);

  // Verify active session with the backend
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/admin/auth/me');
      if (res.data?.success && res.data?.admin) {
        setAdmin(res.data.admin);
        setIsAuthenticated(true);
        if (res.data.csrfToken) {
          applyCsrfToken(res.data.csrfToken);
        }
      } else {
        setAdmin(null);
        setIsAuthenticated(false);
        applyCsrfToken('');
      }
    } catch (error) {
      setAdmin(null);
      setIsAuthenticated(false);
      applyCsrfToken('');
    } finally {
      setIsLoading(false);
    }
  }, [applyCsrfToken]);

  useEffect(() => {
    checkAuth();

    // Global interceptor: if any admin request fails with 401, reset auth state
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && error.config?.url?.includes('/api/admin/')) {
          setAdmin(null);
          setIsAuthenticated(false);
          applyCsrfToken('');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [checkAuth, applyCsrfToken]);

  // Sign in action
  const login = async (email, password) => {
    const res = await axios.post('/api/admin/auth/login', { email, password });
    if (res.data?.success && res.data?.admin) {
      setAdmin(res.data.admin);
      setIsAuthenticated(true);
      if (res.data.csrfToken) {
        applyCsrfToken(res.data.csrfToken);
      }
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  // Sign out action
  const logout = async () => {
    try {
      await axios.post('/api/admin/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
      applyCsrfToken('');
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        isLoading,
        csrfToken,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
