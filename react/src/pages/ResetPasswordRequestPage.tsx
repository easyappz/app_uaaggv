import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import AuthForm from '../components/AuthForm';
import { requestPasswordReset } from '../services/api';

const ResetPasswordRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data = await requestPasswordReset(email);
      setSuccessMessage('A reset link has been sent to your email. Check your inbox for further instructions.');
      setTimeout(() => {
        navigate('/reset-password', { state: { token: data.token } });
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Email', name: 'email', value: email, onChange: handleChange },
  ];

  return (
    <AuthForm
      title="Reset Password"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel={loading ? 'Sending...' : 'Send Reset Link'}
      additionalContent={
        <>
          {successMessage && (
            <Typography variant="body2" color="success.main" align="center" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}
          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Remember your password? <Link to="/login">Log in</Link>
          </Typography>
        </>
      }
    />
  );
};

export default ResetPasswordRequestPage;
