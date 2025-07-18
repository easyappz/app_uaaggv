import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import PhotoRater from '../components/PhotoRater';
import { getPhotoForRating, submitRating, getUserPoints } from '../services/api';

const RatePhotoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [photoData, setPhotoData] = useState<{ photoId: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/login', { state: { message: 'Please log in to rate photos.' } });
      return;
    }
    setUserId(storedUserId);
    fetchUserPoints(storedUserId);
    fetchPhotoForRating(storedUserId);
  }, [navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  }, [location.state]);

  const fetchUserPoints = async (id: string) => {
    try {
      const data = await getUserPoints(id);
      setPoints(data.points);
    } catch (err) {
      setError('Failed to load user data.');
    }
  };

  const fetchPhotoForRating = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhotoForRating(id);
      setPhotoData(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load photo for rating.');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (score: number) => {
    if (!userId || !photoData) return;
    setLoading(true);
    setError(null);

    try {
      const data = await submitRating({
        userId,
        photoId: photoData.photoId,
        score,
      });
      setSuccessMessage('Rating submitted! Points updated.');
      setPoints(data.points);
      setPhotoData(null);
      setTimeout(() => {
        fetchPhotoForRating(userId);
        setSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit rating. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 2 }}>
        Rate Photos
      </Typography>
      {points !== null && (
        <Typography variant="subtitle1" align="center" gutterBottom>
          Your Points: {points}
        </Typography>
      )}
      {successMessage && (
        <Typography variant="body2" color="success.main" align="center" sx={{ mb: 2 }}>
          {successMessage}
        </Typography>
      )}
      <PhotoRater
        photoUrl={photoData?.url || null}
        onRate={handleRate}
        loading={loading}
        error={error}
      />
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/upload')}
          disabled={loading}
        >
          Upload a Photo
        </Button>
      </Box>
    </Box>
  );
};

export default RatePhotoPage;
