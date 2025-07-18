import axios from 'axios';

// API base URL
const API_BASE_URL = '/';

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User Registration
export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  gender: string;
  age: number;
  city: string;
}) => {
  const response = await apiClient.post('/api/register', userData);
  return response.data;
};

// User Login
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await apiClient.post('/api/login', credentials);
  return response.data;
};

// Request Password Reset
export const requestPasswordReset = async (email: string) => {
  const response = await apiClient.post('/api/reset-password-request', { email });
  return response.data;
};

// Reset Password
export const resetPassword = async (token: string, newPassword: string) => {
  const response = await apiClient.post('/api/reset-password', { token, newPassword });
  return response.data;
};

// Upload Photo
export const uploadPhoto = async (userId: string, photoUrl: string) => {
  const response = await apiClient.post('/api/upload-photo', { userId, photoUrl });
  return response.data;
};

// Get Photo for Rating
export const getPhotoForRating = async (userId: string) => {
  const response = await apiClient.get(`/api/get-photo/${userId}`);
  return response.data;
};

// Submit Rating
export const submitRating = async (ratingData: {
  userId: string;
  photoId: string;
  score: number;
}) => {
  const response = await apiClient.post('/api/submit-rating', ratingData);
  return response.data;
};

// Get Analytics for Photo
export const getAnalytics = async (photoId: string) => {
  const response = await apiClient.get(`/api/analytics/${photoId}`);
  return response.data;
};

// Get User Points
export const getUserPoints = async (userId: string) => {
  const response = await apiClient.get(`/api/points/${userId}`);
  return response.data;
};

export default apiClient;
