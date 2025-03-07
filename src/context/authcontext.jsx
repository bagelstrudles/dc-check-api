import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

// Create auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user data on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.updatePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return authService.isAdmin();
  };

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updatePassword,
        isAdmin,
        isAuthenticated: authService.isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
