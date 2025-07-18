import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

const UploadPhotoPage = () => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { uploadPhoto, loading, error: apiError } = useApi();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadPhoto(user.userId, photoUrl);
      setSuccess(true);
      setError('');
      setPhotoUrl('');
    } catch (err) {
      setError(apiError || 'Failed to upload photo');
      setSuccess(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upload Photo for Evaluation
      </Typography>
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Photo uploaded successfully!
        </Alert>
      ) : (
        <>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              required
              placeholder="Enter a valid photo URL"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Upload Photo'}
            </Button>
          </form>
        </>
      )}
    </Box>
  );
};

export default UploadPhotoPage;
