import { useState, useCallback } from 'react';
import axios from 'axios';

// Base URL for API requests
const BASE_URL = '/';

// Custom hook for API interactions
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to make API calls
  const request = useCallback(async (method, endpoint, data = null) => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        method,
        url: `${BASE_URL}api${endpoint}`,
      };
      if (data) {
        config.data = data;
      }
      const response = await axios(config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'API request failed');
      throw err;
    }
  }, []);

  // Register a new user
  const register = async (userData) => {
    return request('post', '/register', userData);
  };

  // Login a user
  const login = async (credentials) => {
    return request('post', '/login', credentials);
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    return request('post', '/reset-password-request', { email });
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    return request('post', '/reset-password', { token, newPassword });
  };

  // Upload a photo
  const uploadPhoto = async (userId, photoUrl) => {
    return request('post', '/upload-photo', { userId, photoUrl });
  };

  // Get a photo for evaluation
  const getPhotoForEvaluation = async (userId) => {
    return request('get', `/get-photo/${userId}`);
  };

  // Submit a rating for a photo
  const submitRating = async (userId, photoId, score) => {
    return request('post', '/submit-rating', { userId, photoId, score });
  };

  // Get analytics for a photo
  const getAnalytics = async (photoId) => {
    return request('get', `/analytics/${photoId}`);
  };

  // Get user points
  const getUserPoints = async (userId) => {
    return request('get', `/points/${userId}`);
  };

  return {
    loading,
    error,
    register,
    login,
    requestPasswordReset,
    resetPassword,
    uploadPhoto,
    getPhotoForEvaluation,
    submitRating,
    getAnalytics,
    getUserPoints,
  };
};
