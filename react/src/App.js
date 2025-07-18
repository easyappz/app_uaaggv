import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordRequestPage from './pages/ResetPasswordRequestPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UploadPage from './pages/UploadPage';
import RatingPage from './pages/RatingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UserPhotosPage from './pages/UserPhotosPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password-request" element={<ResetPasswordRequestPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/upload" element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } />
            <Route path="/rating" element={
              <ProtectedRoute>
                <RatingPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics/:photoId" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/my-photos" element={
              <ProtectedRoute>
                <UserPhotosPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
