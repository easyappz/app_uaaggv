import { useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (endpoint, method = 'GET', body = null) => {
    setLoading(true);
    setError('');

    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`/api${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (userId, photoUrl) => {
    return fetchData('/upload-photo', 'POST', { userId, photoUrl });
  };

  const getUserPhotos = async (userId) => {
    return fetchData(`/user-photos/${userId}`, 'GET');
  };

  const getAnalytics = async (photoId) => {
    return fetchData(`/analytics/${photoId}`, 'GET');
  };

  return {
    uploadPhoto,
    getUserPhotos,
    getAnalytics,
    loading,
    error,
  };
};
