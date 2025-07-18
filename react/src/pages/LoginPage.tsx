import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../services/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData);
      // Store userId in localStorage or context for simplicity (in a real app, use JWT or similar)
      localStorage.setItem('userId', data.userId);
      navigate('/upload');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Email', name: 'email', value: formData.email, onChange: handleChange },
    { label: 'Password', name: 'password', type: 'password', value: formData.password, onChange: handleChange },
  ];

  return (
    <AuthForm
      title="Welcome Back"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel={loading ? 'Logging in...' : 'Login'}
      additionalContent={
        <>
          {successMessage && (
            <Typography variant="body2" color="success.main" align="center" sx={{ mb: 2 }}>
              {successMessage}
            </Typography>
          )}
          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <Link to="/reset-password-request">Forgot Password?</Link>
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </Typography>
        </>
      }
    />
  );
};

export default LoginPage;
