import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, CircularProgress, Alert } from '@mui/material';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const UserPhotosPage = () => {
  const { user } = useAuth();
  const { getUserPhotos, loading, error } = useApi();
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getUserPhotos(user.userId);
        setPhotos(data.photos || []);
      } catch (err) {
        // Error is handled by useApi hook
      }
    };

    fetchPhotos();
  }, [user.userId, getUserPhotos]);

  const handleViewAnalytics = (photoId) => {
    navigate(`/analytics/${photoId}`);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Uploaded Photos
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && photos.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You have not uploaded any photos yet.
        </Alert>
      )}

      {!loading && !error && photos.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo._id}>
              <Card sx={{ maxWidth: 345, m: 'auto' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.url}
                  alt="Uploaded photo"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded on: {new Date(photo.uploadedAt).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => handleViewAnalytics(photo._id)}
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserPhotosPage;
