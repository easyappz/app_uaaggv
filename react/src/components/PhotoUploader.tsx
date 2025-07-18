import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface PhotoUploaderProps {
  onUpload: (file: File) => void;
  loading: boolean;
  error: string | null;
  previewUrl: string | null;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onUpload,
  loading,
  error,
  previewUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

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
        Upload Your Photo
      </Typography>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{ mt: 2, mb: 2 }}
      >
        Choose Photo
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {file && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected: {file.name}
        </Typography>
      )}
      {previewUrl && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
          />
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || loading}
        fullWidth
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Upload Photo'}
      </Button>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PhotoUploader;
