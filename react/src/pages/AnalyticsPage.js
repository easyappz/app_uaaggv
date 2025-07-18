import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useApi } from '../hooks/useApi';
import AnalyticsTable from '../components/AnalyticsTable';
import AnalyticsSummary from '../components/AnalyticsSummary';
import ScoreChart from '../components/ScoreChart';

const AnalyticsPage = () => {
  const { photoId } = useParams();
  const { getAnalytics, loading, error } = useApi();
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics(photoId);
        setAnalytics(data.analytics || []);
      } catch (err) {
        // Error is handled by useApi hook
      }
    };

    fetchAnalytics();
  }, [photoId, getAnalytics]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Photo Analytics
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && analytics.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No analytics data available for this photo.
        </Alert>
      )}

      {!loading && !error && analytics.length > 0 && (
        <>
          <AnalyticsSummary analytics={analytics} />
          <ScoreChart analytics={analytics} />
          <AnalyticsTable analytics={analytics} />
        </>
      )}
    </Box>
  );
};

export default AnalyticsPage;
