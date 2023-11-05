import React, { useState } from 'react';
import InputField from '@/app/components/Authentication/Login/InputField';
import { AiOutlineMail } from 'react-icons/ai';
import { Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import EditIcon from '@mui/icons-material/Edit';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { IUser } from '@/app/models/User';
import useSettingsManager from '@/app/hooks/useSettingsManager';

interface EmailInputProps {
  currentUser: Partial<IUser>;
}

/**
 * `UpdateEmailField` is a React functional component that provides a form for updating a user's email address.
 *
 * @remarks
 * This component is designed for use in settings where a user can update their email address.
 *
 * @param props - The component's props.
 * @param props.currentUser - The current user of the application
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 *
 */
const UpdateEmailForm: React.FC<EmailInputProps> = ({ currentUser }) => {
  // state for handling error
  const [isError, setIsError] = useState(false);
  // State for handling value of input field
  const [email, setEmail] = useState(currentUser?.email);
  // Temporary state for handling feedback
  const [success, setSuccess] = useState('');

  const { updateEmail } = useSettingsManager();
  const clearError = () => {
    setIsError(false);
  };

  // function for null-checking the currentuser.email value.
  const getEmail = (): string => {
    if (currentUser.email !== undefined) return currentUser.email;
    return 'Current User Unavailable';
  };

  // Function for submitting the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // This covers the bare minimum of feedback, and is only temporary.
      // Also calls the function to update the email.
      if (email !== undefined) setSuccess(await updateEmail(email));
    } catch (error) {
      setIsError(true);
      console.error('Error updating email', error);
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<EditIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>Email</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{getEmail()}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleSubmit}>
          <p>{success}</p>
          <div data-cy="email">
            <InputField
              label="Update Email"
              icon={<AiOutlineMail />}
              clearError={clearError}
              error={isError}
              isRequired={true}
              onChange={(e) => setEmail(e.target.value)}
              type={'email'}
              value={email}
            />
          </div>
          <Button variant="contained" color="primary" type="submit">
            Update Email
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default UpdateEmailForm;
