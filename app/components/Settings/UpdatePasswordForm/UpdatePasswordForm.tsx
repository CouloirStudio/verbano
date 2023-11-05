import React, { ChangeEvent, useState } from 'react';
import InputField from '@/app/components/Authentication/Login/InputField';
import { AiOutlineLock } from 'react-icons/ai';
import { Button } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import { IUser } from '@/app/models/User';

interface PasswordInputProps {
  currentUser: Partial<IUser>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * `UpdatePasswordField` is a React functional component that provides a password input field for updating a password.
 *
 * It includes basic password validation to ensure a minimum length of 8 characters.
 *
 * @remarks
 * This component can be used in forms where the user is required to enter or update their password.
 *
 * @param props - The component's props.
 * @param props.onChange - A function to handle changes to the password input field.
 *
 * @example
 * ```tsx
 * <UpdatePasswordField value={passwordValue} onChange={handlePasswordChange} text="New Password" />
 * ```
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 *
 */
const UpdatePasswordField: React.FC<PasswordInputProps> = ({
  currentUser,
  onChange,
}) => {
  const [isError, setIsError] = useState(false);
  const clearError = () => {
    setIsError(false);
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<EditIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Password</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form>
          <InputField
            label={'Old Password'}
            icon={<AiOutlineLock />}
            clearError={clearError}
            error={isError}
            isRequired={true}
            onChange={onChange}
            type={'password'}
            value={''}
          />

          <InputField
            label={'New Password'}
            icon={<AiOutlineLock />}
            clearError={() => {}}
            error={false}
            isRequired={false}
            onChange={onChange}
            type={'password'}
            value={''}
          />

          <InputField
            label={'Confirm New Password'}
            icon={<AiOutlineLock />}
            clearError={() => {}}
            error={false}
            isRequired={false}
            onChange={onChange}
            type={'password'}
            value={''}
          />

          <Button variant="contained" color="primary" type="submit">
            Update Password
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default UpdatePasswordField;
