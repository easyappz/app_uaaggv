import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const AnalyticsSummary = ({ analytics }) => {
  const totalRatings = analytics.length;
  const averageScore =
    totalRatings > 0
      ? analytics.reduce((sum, rating) => sum + rating.score, 0) / totalRatings
      : 0;

  const genderDistribution = {
    male: 0,
    female: 0,
    other: 0,
  };

  analytics.forEach((rating) => {
    genderDistribution[rating.rater.gender]++;
  });

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        Summary
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1">Total Ratings: {totalRatings}</Typography>
      <Typography variant="body1">Average Score: {averageScore.toFixed(2)}</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Gender Distribution
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1">Male: {genderDistribution.male}</Typography>
      <Typography variant="body1">Female: {genderDistribution.female}</Typography>
      <Typography variant="body1">Other: {genderDistribution.other}</Typography>
    </Box>
  );
};

export default AnalyticsSummary;
