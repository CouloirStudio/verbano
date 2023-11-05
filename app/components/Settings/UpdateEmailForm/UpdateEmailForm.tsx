import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Authentication/Login/InputField';
import { AiOutlineMail } from 'react-icons/ai';
import { Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import EditIcon from '@mui/icons-material/Edit';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

interface EmailInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * `UpdateEmailField` is a React functional component that provides an input field for updating a user's email address.
 *
 * @remarks
 * This component is designed for use in forms where a user can update their email address.
 *
 * @param props - The component's props.
 * @param props.value - The current value of the email input field.
 * @param props.onChange - A function to handle changes to the email input field.
 *
 * @example
 * ```tsx
 * <UpdateEmailField value={emailValue} onChange={handleEmailChange} />
 * ```
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 *
 */
const UpdateEmailForm: React.FC<EmailInputProps> = ({ value, onChange }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<EditIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Email</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form>
          <InputField
            label="Update Email"
            icon={<AiOutlineMail />}
            clearError={() => {}}
            error={false}
            isRequired={true}
            onChange={onChange}
            type={'email'}
            value={value}
          />
          <Button variant="contained" color="primary" type="submit">
            Update Email
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default UpdateEmailForm;
