import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from './ErrorBoundary';
import Layout from './components/Layout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordRequestPage from './pages/ResetPasswordRequestPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UploadPhotoPage from './pages/UploadPhotoPage';
import RatePhotoPage from './pages/RatePhotoPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RatingPage from './pages/RatingPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password-request" element={<ResetPasswordRequestPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPhotoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rate"
              element={
                <ProtectedRoute>
                  <RatePhotoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rating"
              element={
                <ProtectedRoute>
                  <RatingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics/:photoId"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
