import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../services/api';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    gender: '',
    age: '',
    city: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerUser({
        ...formData,
        age: parseInt(formData.age, 10),
      });
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Email', name: 'email', value: formData.email, onChange: handleChange },
    { label: 'Password', name: 'password', type: 'password', value: formData.password, onChange: handleChange },
    { label: 'Name', name: 'name', value: formData.name, onChange: handleChange },
    { label: 'Gender', name: 'gender', value: formData.gender, onChange: handleChange },
    { label: 'Age', name: 'age', type: 'number', value: formData.age, onChange: handleChange },
    { label: 'City', name: 'city', value: formData.city, onChange: handleChange },
  ];

  return (
    <AuthForm
      title="Create Account"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel={loading ? 'Registering...' : 'Register'}
      additionalContent={
        <>
          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Log in</Link>
          </Typography>
        </>
      }
    />
  );
};

export default RegisterPage;
