import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import AnalyticsChart from '../components/AnalyticsChart';
import { getAnalytics } from '../services/api';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { photoId } = useParams<{ photoId: string }>(); // Get photoId from URL
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login', { state: { message: 'Please log in to view analytics.' } });
      return;
    }
    if (!photoId) {
      setError('No photo ID provided.');
      setLoading(false);
      return;
    }
    fetchAnalytics(photoId);
  }, [navigate, photoId]);

  const fetchAnalytics = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics(id);
      setAnalyticsData(data.analytics || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Photo Rating Analytics
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            Loading analytics data...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      ) : (
        <AnalyticsChart data={analyticsData} />
      )}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/upload')}
        >
          Back to Upload
        </Button>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
