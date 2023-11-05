import React, { ChangeEvent, useState } from 'react';
import InputField from '@/app/components/Authentication/Login/InputField';
import { AiOutlineUser } from 'react-icons/ai';
import { Button } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import { IUser } from '@/app/models/User';

interface FullNameInputProps {
  currentUser: Partial<IUser>;
  onFirstNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * `UpdateFullName` is a React functional component that provides input fields for updating a user's first name and last name with customizable labels.
 *
 * @remarks
 * This component is designed for use in forms where a user can update their full name.
 *
 * @param props - The component's props.
 * @param props.currentUser - The current user of the Application
 * @param props.onFirstNameChange - A function to handle changes to the first name input field.
 * @param props.onLastNameChange - A function to handle changes to the last name input field.
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
const UpdateNameForm: React.FC<FullNameInputProps> = ({
  currentUser,
  onFirstNameChange,
  onLastNameChange,
}) => {
  const [isError, setIsError] = useState(false);
  const clearError = () => {
    setIsError(false);
  };

  const getFirst = (): string => {
    if (currentUser.firstName !== undefined) return currentUser.firstName;
    return 'Current User Unavailable';
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
        <form>
          <InputField
            label="Update First Name"
            icon={<AiOutlineUser />}
            clearError={clearError}
            error={isError}
            isRequired={true}
            onChange={onFirstNameChange}
            type={'text'}
            value={getFirst()}
          />
          <InputField
            label="Update Last Name"
            icon={<AiOutlineUser />}
            clearError={clearError}
            error={isError}
            isRequired={false}
            onChange={onLastNameChange}
            type={'text'}
            value={getLast()}
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
