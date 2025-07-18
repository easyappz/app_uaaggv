import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import PhotoUploader from '../components/PhotoUploader';
import { useAuth } from '../context/AuthContext';
import { getUserPoints, uploadPhoto } from '../services/api';


const UploadPage: React.FC = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState<number>(0);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(true);
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      if (user) {
        try {
          setLoadingPoints(true);
          const data = await getUserPoints(user.userId);
          setPoints(data.points);
        } catch (err) {
          setError('Failed to load user points. Please try again later.');
        } finally {
          setLoadingPoints(false);
        }
      }
    };

    fetchPoints();
  }, [user]);

  const handleUpload = async (file: File) => {
    if (!user) {
      setError('You must be logged in to upload photos.');
      return;
    }

    if (points <= 0) {
      setError('You do not have enough points to upload a photo for evaluation.');
      return;
    }

    setLoadingUpload(true);
    setError(null);
    setSuccess(null);

    try {
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate photo upload (replace with actual file upload logic if needed)
      const photoUrl = URL.createObjectURL(file);
      await uploadPhoto(user.userId, photoUrl);
      setSuccess('Photo uploaded successfully! It is now available for evaluation.');
      setPreviewUrl(null); // Clear preview after successful upload
      setPoints(points - 1); // Deduct a point after successful upload
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Upload Photos for Evaluation
      </Typography>

      {loadingPoints ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 2, mb: 4 }}>
          Available Points: {points} {points === 1 ? '(1 upload)' : `(${points} uploads)`}
        </Typography>
      )}

      {points === 0 && !loadingPoints && (
        <Alert severity="warning" sx={{ mb: 4, textAlign: 'center' }}>
          You need at least 1 point to upload a photo for evaluation. Rate other photos to earn points.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4, textAlign: 'center' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 4, textAlign: 'center' }}>
          {success}
        </Alert>
      )}

      <PhotoUploader
        onUpload={handleUpload}
        loading={loadingUpload}
        error={null}
        previewUrl={previewUrl}
      />

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          href="/rating"
          disabled={loadingPoints || loadingUpload}
          sx={{ mt: 2 }}
        >
          Earn Points by Rating Photos
        </Button>
      </Box>
    </Box>
  );
};

export default UploadPage;
