import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

interface AuthFormProps {
  title: string;
  fields: Array<{
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }>;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  additionalContent?: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  fields,
  onSubmit,
  submitLabel,
  additionalContent,
}) => {
  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        {title}
      </Typography>
      <form onSubmit={onSubmit}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            fullWidth
            margin="normal"
            label={field.label}
            name={field.name}
            type={field.type || 'text'}
            value={field.value}
            onChange={field.onChange}
            required={field.required !== false}
            variant="outlined"
          />
        ))}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3, mb: 2 }}
        >
          {submitLabel}
        </Button>
        {additionalContent}
      </form>
    </Box>
  );
};

export default AuthForm;
