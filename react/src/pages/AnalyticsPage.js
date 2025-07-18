import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Alert, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useApi } from '../hooks/useApi';

const AnalyticsPage = () => {
  const { photoId } = useParams();
  const [analytics, setAnalytics] = useState([]);
  const [error, setError] = useState('');
  const { getAnalytics, loading, error: apiError } = useApi();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics(photoId);
        setAnalytics(data.analytics);
        setError('');
      } catch (err) {
        setError(apiError || 'Failed to load analytics');
        setAnalytics([]);
      }
    };
    fetchAnalytics();
  }, [photoId, getAnalytics, apiError]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Photo Analytics
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {analytics.length > 0 ? (
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Score</TableCell>
              <TableCell>Rated At</TableCell>
              <TableCell>Rater Gender</TableCell>
              <TableCell>Rater Age</TableCell>
              <TableCell>Rater City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.score}</TableCell>
                <TableCell>{new Date(entry.ratedAt).toLocaleString()}</TableCell>
                <TableCell>{entry.rater.gender}</TableCell>
                <TableCell>{entry.rater.age}</TableCell>
                <TableCell>{entry.rater.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : !loading && !error ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No analytics available for this photo.
        </Typography>
      ) : null}
    </Box>
  );
};

export default AnalyticsPage;
