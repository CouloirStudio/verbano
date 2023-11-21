import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { IUser } from '@/app/models/User';
import InputField from '../../Authentication/Login/InputField';
import { AiOutlineDelete } from 'react-icons/ai';
import DeleteUserAccount from '@/app/graphql/mutations/DeleteUserAccount.graphql';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Button, Stack } from '@mui/material';
import Box from '@mui/material/Box';

interface DeleteAccountProps {
  currentUser: Partial<IUser>;
}

/**
 * A functional component that holds the form for deleting a user account.
 * @param currentUser The current user of the app
 */
const DeleteAccount: React.FC<DeleteAccountProps> = ({ currentUser }) => {
  const [disabled, setIsDisabled] = useState(true);
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [inputText, setInputText] = useState('');
  const [deleteUserAccount] = useMutation(DeleteUserAccount);

  useEffect(() => {
    // Check if the entered email is correct
    setIsDisabled(!(inputText.toLowerCase() === 'delete'));
  }, [inputText]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (e.target.value == currentUser.email) setIsDisabled(false);
  };

  /**
   * Function for handling account deletion using graphql
   */
  const handleDeleteAccount = async () => {
    try {
      // Use the deleteUserAccount mutation to delete the user account
      await deleteUserAccount({
        variables: {
          id: currentUser.id,
          input: {
            email: currentUser.email,
          },
        },
      });

      // Handle successful deletion, e.g., redirect, display a message, etc.
      alert('User account deleted successfully');
      window.location.href = '/logout';
    } catch (error) {
      console.error('Error deleting user account:', error);
      alert('Account not deleted');
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<EditIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography fontWeight={'600'}>Delete Account</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Typography>
            You will permanently lose access to your account and all of its
            data. You will not be able to undo this action. You will no longer
            have access to the features provided by Verbano.
          </Typography>
          <Typography>
            Please enter 'delete' in the field below to confirm deletion.
          </Typography>
          <InputField
            clearError={() => setIsErrorEmail(false)}
            error={isErrorEmail}
            icon={<AiOutlineDelete />}
            isRequired={true}
            label={'Delete'}
            onChange={handleFieldChange}
            type={'text'}
            value={inputText}
          />
          <Box>
            <Button
              variant="contained"
              color="error"
              disabled={disabled}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default DeleteAccount;
