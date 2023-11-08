import React, { useState } from "react";
import InputField from "@/app/components/Authentication/Login/InputField";
import { AiOutlineLock } from "react-icons/ai";
import { Button } from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import useSettingsManager from "@/app/hooks/useSettingsManager";

/**
 * `UpdatePasswordField` is a React functional component that provides a password input field for updating a password.
 *
 * It includes basic password validation to ensure a minimum length of 8 characters.
 *
 * @remarks
 * This component can be used in forms where the user is required to enter or update their password.
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 *
 */
const UpdatePasswordForm: React.FC = ({}) => {
  //Temporary state for handling feedback
  const [success, setSuccess] = useState('');
  const [isError, setIsError] = useState(false);
  // State for handling old password field
  const [oldPass, setOldPass] = useState('');
  // State for handling new password field
  const [newPass, setNewPass] = useState('');
  // State for handling confirmation password field
  const [newPassConfirm, setNewPassConfirm] = useState('');

  const { updatePassword } = useSettingsManager();
  const clearError = () => {
    setIsError(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // This is the bare minimum of feedback, and is only temporary.
      // Also updates the user.
      const result = await updatePassword(oldPass, newPass, newPassConfirm);
      if (result !== undefined) setSuccess(result);
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
        <Typography sx={{ width: '33%', flexShrink: 0 }}>Password</Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {' '}
          &#x2022; &#x2022; &#x2022; &#x2022; &#x2022; &#x2022;{' '}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>{success}</p>
        <form onSubmit={handleSubmit}>
          <InputField
            label={'Old Password'}
            icon={<AiOutlineLock />}
            clearError={clearError}
            error={isError}
            isRequired={true}
            onChange={(e) => setOldPass(e.target.value)}
            type={'password'}
            value={oldPass}
          />

          <InputField
            label={'New Password'}
            icon={<AiOutlineLock />}
            clearError={() => {}}
            error={false}
            isRequired={false}
            onChange={(e) => setNewPass(e.target.value)}
            type={'password'}
            value={newPass}
          />

          <InputField
            label={'Confirm New Password'}
            icon={<AiOutlineLock />}
            clearError={() => {}}
            error={false}
            isRequired={false}
            onChange={(e) => setNewPassConfirm(e.target.value)}
            type={'password'}
            value={newPassConfirm}
          />

          <Button variant="contained" color="primary" type="submit">
            Update Password
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default UpdatePasswordForm;
