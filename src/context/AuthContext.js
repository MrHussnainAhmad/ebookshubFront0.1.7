import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create API instance with base URL
const API = axios.create({
  baseURL: 'https://ebookshub.up.railway.app/api'
});
// Add token to all requests if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from token on startup
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const res = await API.get('/auth/user-details');
        setUser(res.data.user);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token'); // Clear invalid token
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      
      // Check if user is verified
      if (!res.data.user.verified) {
        setLoading(false);
        return {
          success: false,
          needsVerification: true,
          error: "Please verify your email before logging in",
          email: res.data.user.email,
        };
      }

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      
      // Check if this is a verification error
      if (err.response?.data?.needsVerification) {
        return {
          success: false,
          error: errorMessage,
          needsVerification: true,
          email: err.response?.data?.email || email,
        };
      }
      
      return { success: false, error: errorMessage, details: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const res = await API.post('/auth/register', userData);
      return { 
        success: true, 
        message: res.data.message || "Account created successfully",
        needsVerification: true,
        email: userData.email
      };
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      const errorType = err.response?.data?.type || 'unknown';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage, 
        errorType: errorType,
        details: err.response?.data 
      };
    } finally {
      setLoading(false);
    }
  };

  // Update verification status
  const updateVerificationStatus = async (isVerified) => {
    try {
      if (user) {
        const updatedUser = { ...user, verified: isVerified };
        setUser(updatedUser);
      }
      return { success: true };
    } catch (error) {
      console.error("Error updating verification status:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function - Now returns a value to indicate redirection should happen
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    
    // Instead of directly navigating, we set location manually
    window.location.href = '/';
  };

  // Update user function
  const updateUser = async (updatedData) => {
    try {
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Update user error:', err);
      return { success: false, error: err.message };
    }
  };

  // Refresh user data from the server
  const refreshUserData = async () => {
    try {
      const res = await API.get('/auth/user-details');
      setUser(res.data.user);
      return { success: true, data: res.data.user };
    } catch (err) {
      console.error('Error refreshing user data:', err);
      return { success: false, error: err.message };
    }
  };

  // Update user type
  const updateUserType = async (userType) => {
    try {
      // Update user type in the backend
      await API.post('/auth/update-user-type', { userType });
      
      // Update local state
      setUser((prevUser) => ({
        ...prevUser,
        userType
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Update user type error:', err);
      return { success: false, error: err.message };
    }
  };

  // Fetch admin dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const res = await API.get('/admin/dashboard-stats');
      return { success: true, data: res.data.data };
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to fetch dashboard stats' };
    }
  };

  // Fetch all users for admin
  const fetchAllUsers = async (page = 1, limit = 20) => {
    try {
      const res = await API.get(`/admin/users?page=${page}&limit=${limit}`);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Error fetching users:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to fetch users' };
    }
  };

  // Fetch all books for admin
  const fetchAllBooks = async (page = 1, limit = 20) => {
    try {
      const res = await API.get(`/admin/books?page=${page}&limit=${limit}`);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Error fetching books:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to fetch books' };
    }
  };

  // Update user as admin
  const adminUpdateUser = async (userId, userData) => {
    try {
      const res = await API.put(`/admin/users/${userId}`, userData);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Error updating user:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to update user' };
    }
  };

  // Delete user as admin
  const adminDeleteUser = async (userId) => {
    try {
      const res = await API.delete(`/admin/users/${userId}`);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Error deleting user:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to delete user' };
    }
  };

  // Toggle premium status for a book
  const toggleBookPremium = async (bookId, isPremium, premiumDisplayUntil = null) => {
    try {
      const res = await API.put(`/admin/books/${bookId}/toggle-premium`, {
        isPremium,
        premiumDisplayUntil
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Error toggling book premium status:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to update book premium status' };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    refreshUserData,
    updateVerificationStatus,
    updateUserType,
    isAuthenticated: !!user,
    isAuthor: user?.userType === 'author',
    isReader: user?.userType === 'reader' || !user?.userType,
    isAdmin: user?.userType === 'admin',
    // Admin functions
    fetchDashboardStats,
    fetchAllUsers,
    fetchAllBooks,
    adminUpdateUser,
    adminDeleteUser,
    toggleBookPremium
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};