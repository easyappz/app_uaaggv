import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useApi } from '../hooks/useApi';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ token: '', newPassword: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword, loading, error: apiError } = useApi();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(formData.token, formData.newPassword);
      setSuccess(true);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(apiError || 'Failed to reset password');
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
          Password reset successful. Redirecting to login...
        </Alert>
      ) : (
        <>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Reset Token"
              name="token"
              value={formData.token}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </>
      )}
    </Box>
  );
};

export default ResetPasswordPage;
