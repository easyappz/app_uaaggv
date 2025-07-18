import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import AuthForm from '../components/AuthForm';
import { resetPassword } from '../services/api';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tokenFromState = location.state?.token || '';
  const [formData, setFormData] = useState({ token: tokenFromState, newPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await resetPassword(formData.token, formData.newPassword);
      setSuccessMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Reset Token', name: 'token', value: formData.token, onChange: handleChange },
    { label: 'New Password', name: 'newPassword', type: 'password', value: formData.newPassword, onChange: handleChange },
  ];

  return (
    <AuthForm
      title="Set New Password"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel={loading ? 'Resetting...' : 'Reset Password'}
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
            Need a new reset link? <Link to="/reset-password-request">Request one</Link>
          </Typography>
        </>
      }
    />
  );
};

export default ResetPasswordPage;
