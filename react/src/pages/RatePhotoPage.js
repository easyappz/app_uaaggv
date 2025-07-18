import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Alert, Slider, Card, CardMedia, CardContent } from '@mui/material';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const RatePhotoPage = () => {
  const [photo, setPhoto] = useState(null);
  const [score, setScore] = useState(5);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { getPhotoForEvaluation, submitRating, loading, error: apiError } = useApi();
  const { user } = useAuth();

  const fetchPhoto = async () => {
    try {
      const data = await getPhotoForEvaluation(user.userId);
      setPhoto(data);
      setError('');
      setSuccess(false);
    } catch (err) {
      setError(apiError || 'Failed to load photo for evaluation');
      setPhoto(null);
    }
  };

  useEffect(() => {
    fetchPhoto();
  }, []);

  const handleSubmit = async () => {
    try {
      await submitRating(user.userId, photo.photoId, score);
      setSuccess(true);
      setError('');
      setTimeout(fetchPhoto, 1000);
    } catch (err) {
      setError(apiError || 'Failed to submit rating');
      setSuccess(false);
    }
  };

  if (!photo) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          No photos available for evaluation
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button
          variant="contained"
          onClick={fetchPhoto}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Loading...' : 'Try Again'}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rate This Photo
      </Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Rating submitted successfully!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ mb: 2 }}>
        <CardMedia
          component="img"
          height="300"
          image={photo.url}
          alt="Photo for evaluation"
          sx={{ objectFit: 'contain' }}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Score: {score}
          </Typography>
          <Slider
            value={score}
            onChange={(_, newValue) => setScore(newValue)}
            min={1}
            max={10}
            valueLabelDisplay="auto"
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Rating'}
      </Button>
    </Box>
  );
};

export default RatePhotoPage;
