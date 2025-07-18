import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import PhotoUploader from '../components/PhotoUploader';
import { uploadPhoto, getUserPoints } from '../services/api';

const UploadPhotoPage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/login', { state: { message: 'Please log in to upload photos.' } });
      return;
    }
    setUserId(storedUserId);
    fetchUserPoints(storedUserId);
  }, [navigate]);

  const fetchUserPoints = async (id: string) => {
    try {
      const data = await getUserPoints(id);
      setPoints(data.points);
    } catch (err) {
      setError('Failed to load user data.');
    }
  };

  const handleUpload = async (file: File) => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // In a real app, upload the file to your server or cloud storage and get a URL
      const photoUrl = URL.createObjectURL(file); // Temporary placeholder
      await uploadPhoto(userId, photoUrl);
      setTimeout(() => {
        setLoading(false);
        navigate('/rate', { state: { message: 'Photo uploaded successfully!' } });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload photo. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Upload a Photo for Rating
      </Typography>
      {points !== null && (
        <Typography variant="subtitle1" align="center" gutterBottom>
          Your Points: {points} (1 point required to upload a photo)
        </Typography>
      )}
      {points !== null && points < 1 && (
        <Typography variant="body2" color="error" align="center" sx={{ mb: 3 }}>
          You need at least 1 point to upload a photo. Rate more photos to earn points.
        </Typography>
      )}
      <PhotoUploader
        onUpload={handleUpload}
        loading={loading}
        error={error}
        previewUrl={previewUrl}
      />
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/rate')}
          disabled={loading}
        >
          Rate Photos Instead
        </Button>
      </Box>
    </Box>
  );
};

export default UploadPhotoPage;
