import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useApi } from '../hooks/useApi';

const ResetPasswordRequestPage = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { requestPasswordReset, loading, error: apiError } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(apiError || 'Failed to send reset request');
      setSuccess(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Password reset token sent. Check your email for instructions.
        </Alert>
      ) : (
        <>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Request Reset'}
            </Button>
          </form>
        </>
      )}
    </Box>
  );
};

export default ResetPasswordRequestPage;
