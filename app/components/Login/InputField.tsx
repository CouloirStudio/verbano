import React, { ReactNode } from 'react';
import styles from './login.module.scss';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

interface InputFieldProps {
  value: string;
  onChange: (e: any) => void;
  isRequired: boolean;
  label: string;
  type: string;
  icon: ReactNode;
  error: boolean;
  clearError: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  isRequired,
  label,
  type,
  icon,
  error,
  clearError,
}) => {
  const customOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e); // Call the provided onChange
    if (value === '') {
      clearError();
    }
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      {icon}
      {error ? (
        <TextField
          value={value}
          onChange={customOnChange}
          required={isRequired}
          label={label}
          type={type}
          error
          id="outlined-error-helper-text"
        />
      ) : (
        <TextField
          id="outlined-basic"
          value={value}
          onChange={onChange}
          required={isRequired}
          label={label}
          type={type}
        />
      )}
    </Box>
  );
};

export default InputField;
