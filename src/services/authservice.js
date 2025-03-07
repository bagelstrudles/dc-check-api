import jwtDecode from 'jwt-decode';
import { authAPI } from './api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Get user from localStorage
const getUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

// Check if token is valid and not expired
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Login user
const login = async (email, password) => {
  const response = await authAPI.login({ email, password });
  
  // Store token and user in localStorage
  const { token, data } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data.user;
};

// Register new user
const register = async (userData) => {
  const response = await authAPI.register(userData);
  
  // Store token and user in localStorage
  const { token, data } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data.user;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = getToken();
  return isTokenValid(token);
};

// Get current user profile
const getCurrentUser = async () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  try {
    const response = await authAPI.getProfile();
    const { user } = response.data.data;
    
    // Update user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    // If there's an error, logout and return null
    logout();
    return null;
  }
};

// Check if user is admin
const isAdmin = () => {
  const user = getUser();
  return user && user.role === 'admin';
};

// Update user password
const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await authAPI.updatePassword({
    currentPassword,
    newPassword,
    confirmPassword,
  });
  
  return response.data;
};

export const authService = {
  login,
  register,
  logout,
  getToken,
  getUser,
  isAuthenticated,
  isAdmin,
  getCurrentUser,
  updatePassword,
};
