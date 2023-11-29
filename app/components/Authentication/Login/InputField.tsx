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

/**
 * InputField is a reusable functional component for gathering user input.
 * @param value the value of the text field
 * @param onChange the function called when the input field is changed
 * @param isRequired boolean that represents whether the field is required or not
 * @param label the label of the input field
 * @param type the type of input, can be password, email etc...
 * @param icon the icon to the left of the input field
 * @param error boolean for whether there was an input error
 * @param clearError function that clears the error
 */
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
  /**
   * function that enforces the onChange functional parameter when the input field is changed.
   */
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
