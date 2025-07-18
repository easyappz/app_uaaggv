import React from 'react';
import { Box, Typography } from '@mui/material';

interface RatingData {
  score: number;
  ratedAt: string;
  rater: {
    gender: string;
    age: number;
    city: string;
  };
}

interface AnalyticsChartProps {
  data: RatingData[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No rating data available for this photo.
        </Typography>
      </Box>
    );
  }

  const averageScore =
    data.reduce((sum, item) => sum + item.score, 0) / data.length;

  const genderBreakdown = data.reduce((acc, item) => {
    acc[item.rater.gender] = (acc[item.rater.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ageBreakdown = data.reduce((acc, item) => {
    const ageGroup =
      item.rater.age < 18
        ? 'Under 18'
        : item.rater.age < 30
        ? '18-29'
        : item.rater.age < 50
        ? '30-49'
        : '50+';
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cityBreakdown = data.reduce((acc, item) => {
    acc[item.rater.city] = (acc[item.rater.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: 'auto',
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h6" gutterBottom align="center">
        Rating Analytics
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
        Average Score: {averageScore.toFixed(2)}
      </Typography>

      <Typography variant="subtitle2" gutterBottom>
        Gender Breakdown:
      </Typography>
      {Object.entries(genderBreakdown).map(([gender, count]) => (
        <Typography key={gender} variant="body2">
          {gender}: {count} votes
        </Typography>
      ))}

      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
        Age Breakdown:
      </Typography>
      {Object.entries(ageBreakdown).map(([ageGroup, count]) => (
        <Typography key={ageGroup} variant="body2">
          {ageGroup}: {count} votes
        </Typography>
      ))}

      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
        City Breakdown:
      </Typography>
      {Object.entries(cityBreakdown).map(([city, count]) => (
        <Typography key={city} variant="body2">
          {city}: {count} votes
        </Typography>
      ))}
    </Box>
  );
};

export default AnalyticsChart;
