import React, { useState } from 'react';
import InputField from '@/app/components/Authentication/Login/InputField';
import { AiOutlineUser } from 'react-icons/ai';
import { Button } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import { IUser } from '@/app/models/User';
import useSettingsManager from '@/app/hooks/useSettingsManager';

interface FullNameInputProps {
  currentUser: Partial<IUser>;
}

/**
 * `UpdateFullName` is a React functional component that provides input fields for updating a user's first name and last name with customizable labels.
 *
 * @remarks
 * This component is designed for use in forms where a user can update their full name.
 *
 * @param props - The component's props.
 * @param props.currentUser - The current user of the Application
 *
 * @example
 * ```tsx
 * <UpdateFullName
 *   firstName={firstNameValue}
 *   lastName={lastNameValue}
 *   onFirstNameChange={handleFirstNameChange}
 *   onLastNameChange={handleLastNameChange}
 * />
 * ```
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 */
const UpdateNameForm: React.FC<FullNameInputProps> = ({ currentUser }) => {
  const [firstName, setFirstName] = useState(currentUser?.firstName);
  const [lastName, setLastName] = useState(currentUser?.lastName);
  // Temporary state for handling feedback
  const [success, setSuccess] = useState('');
  const [isError, setIsError] = useState(false);
  const { updateName } = useSettingsManager();
  const clearError = () => {
    setIsError(false);
  };

  const getFirst = (): string => {
    if (currentUser.firstName !== undefined) return currentUser.firstName;
    return 'Current User Unavailable';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // This is the bare minimum of feedback, and is only temporary.
      setSuccess(await updateName(firstName, lastName));
    } catch (error) {
      setIsError(true);
      console.error('Error updating email', error);
    }
  };
  const getLast = (): string => {
    if (currentUser.lastName !== undefined) return currentUser.lastName;
    return 'Current User Unavailable';
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<EditIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>Name</Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {getFirst() + ' ' + getLast()}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleSubmit}>
          <p>{success}</p>
          <InputField
            label="Update First Name"
            icon={<AiOutlineUser />}
            clearError={clearError}
            error={isError}
            isRequired={true}
            onChange={(e) => setFirstName(e.target.value)}
            type={'text'}
            value={firstName}
          />
          <InputField
            label="Update Last Name"
            icon={<AiOutlineUser />}
            clearError={clearError}
            error={isError}
            isRequired={false}
            onChange={(e) => setLastName(e.target.value)}
            type={'text'}
            value={lastName}
          />
          <Button variant="contained" color="primary" type="submit">
            Update Name
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default UpdateNameForm;
