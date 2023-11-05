import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Authentication/Login/InputField';
import { AiOutlineUser } from 'react-icons/ai';
import { Button } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';

interface FullNameInputProps {
  firstName: string;
  lastName: string;
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
 * @param props.firstName - The current value of the first name input field.
 * @param props.lastName - The current value of the last name input field.
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
const UpdateFullName: React.FC<FullNameInputProps> = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<EditIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Name</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form>
          <InputField
            label="Update First Name"
            icon={<AiOutlineUser />}
            clearError={() => {}}
            error={false}
            isRequired={false}
            onChange={onFirstNameChange}
            type={'text'}
            value={firstName}
          />
          <InputField
            label="Update Last Name"
            icon={<AiOutlineUser />}
            clearError={() => {}}
            error={false}
            isRequired={false}
            onChange={onLastNameChange}
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

export default UpdateFullName;
