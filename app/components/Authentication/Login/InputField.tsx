import React, { ReactNode } from 'react';
import TextField from '@mui/material/TextField';
import { InputAdornment, Stack } from '@mui/material';

interface InputFieldProps {
  value: string | undefined;
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
    <Stack direction={'row'} alignItems={'center'}>
      {error ? (
        <TextField
          fullWidth
          value={value}
          onChange={customOnChange}
          required={isRequired}
          label={label}
          type={type}
          error
          id="outlined-error-helper-text"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
          }}
        />
      ) : (
        <TextField
          fullWidth
          id="outlined-basic"
          value={value}
          onChange={onChange}
          required={isRequired}
          label={label}
          type={type}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
          }}
        />
      )}
    </Stack>
  );
};

export default InputField;
