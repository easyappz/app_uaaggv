import React, { useState } from 'react';
import { Box, Button, Typography, Slider, CircularProgress } from '@mui/material';

interface PhotoRaterProps {
  photoUrl: string | null;
  onRate: (score: number) => void;
  loading: boolean;
  error: string | null;
}

const PhotoRater: React.FC<PhotoRaterProps> = ({
  photoUrl,
  onRate,
  loading,
  error,
}) => {
  const [score, setScore] = useState<number>(5);

  const handleScoreChange = (event: Event, newValue: number | number[]) => {
    setScore(newValue as number);
  };

  const handleSubmitRating = () => {
    onRate(score);
  };

  if (!photoUrl) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h6" color="text.secondary">
          No photos available for rating at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Rate This Photo
      </Typography>
      <Box sx={{ mt: 2, mb: 3 }}>
        <img
          src={photoUrl}
          alt="Photo to rate"
          style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
        />
      </Box>
      <Typography variant="subtitle1" gutterBottom>
        Score: {score}
      </Typography>
      <Slider
        value={score}
        onChange={handleScoreChange}
        min={1}
        max={10}
        step={1}
        valueLabelDisplay="auto"
        sx={{ width: '80%', mb: 3 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitRating}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Submit Rating'}
      </Button>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PhotoRater;
