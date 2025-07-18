import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Slider, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Photo {
  photoId: string;
  url: string;
}

const RatingPage: React.FC = () => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noPhotos, setNoPhotos] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/login');
      return;
    }
    setUserId(storedUserId);
    fetchPhoto(storedUserId);
  }, [navigate]);

  const fetchPhoto = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/get-photo/${userId}`);
      if (response.data.error) {
        setNoPhotos(true);
        setPhoto(null);
      } else {
        setPhoto(response.data);
        setNoPhotos(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load photo. Please try again.');
      setNoPhotos(true);
      setPhoto(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (event: Event, newValue: number | number[]) => {
    setRating(newValue as number);
  };

  const handleSubmitRating = async () => {
    if (!photo || !userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/submit-rating', {
        userId,
        photoId: photo.photoId,
        score: rating,
      });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        fetchPhoto(userId);
        setRating(5);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        maxWidth: '100%',
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        minHeight: '80vh',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Rate This Photo
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
          {error}
        </Alert>
      )}

      {noPhotos ? (
        <Typography variant="h6" color="textSecondary" sx={{ mt: 5 }}>
          No more photos available to rate. Please check back later.
        </Typography>
      ) : (
        photo && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 3,
              width: '100%',
              maxWidth: 800,
              mt: 3,
            }}
          >
            <Box
              component="img"
              src={photo.url}
              alt="Photo to rate"
              sx={{
                width: '100%',
                maxWidth: 400,
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                objectFit: 'cover',
              }}
            />
            <Box sx={{ width: '100%', maxWidth: 300 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Your Rating: {rating}
              </Typography>
              <Slider
                value={rating}
                onChange={handleRatingChange}
                min={1}
                max={10}
                valueLabelDisplay="auto"
                sx={{
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderRadius: 1,
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitRating}
                disabled={loading}
                sx={{ mt: 2, width: '100%', padding: 1.5, fontSize: '1rem' }}
              >
                Submit Rating
              </Button>
            </Box>
          </Box>
        )
      )}
    </Box>
  );
};

export default RatingPage;
