import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { IUser } from '@/app/models/User';
import { Button } from '@mui/material';
import InputField from '../../Authentication/Login/InputField';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import CheckCurrentPassword from '@/app/graphql/queries/CheckCurrentPassword.graphql';
import DeleteUserAccount from '@/app/graphql/mutations/DeleteUserAccount.graphql';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

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
  const [isErrorPassword, setIsErrorPassword] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [checkPassword, { data }] = useLazyQuery(CheckCurrentPassword);
  const [deleteUserAccount] = useMutation(DeleteUserAccount);

  useEffect(() => {
    // Check if the entered email is correct
    setIsDisabled(!(inputEmail === currentUser.email));
  }, [inputEmail, currentUser.email]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value);
    if (e.target.value == currentUser.email) setIsDisabled(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };

  /**
   * Function for handling account deletion using graphql
   */
  const handleDeleteAccount = async () => {
    try {
      await checkPassword({
        variables: {
          email: inputEmail,
          password: inputPassword,
        },
      });

      if (data == false) {
        setFeedback('Incorrect Password');
        return;
      }
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
        <Typography sx={{ width: '33%', flexShrink: 0 }}>
          Delete Account
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleDeleteAccount}>
          <div data-cy="email">
            <p>{feedback}</p>
            <InputField
              clearError={() => setIsErrorEmail(false)}
              error={isErrorEmail}
              icon={<AiOutlineMail />}
              isRequired={true}
              label={'Confirm Current Email'}
              onChange={handleEmailChange}
              type={'text'}
              value={inputEmail}
            />
            <br />
            <InputField
              clearError={() => setIsErrorPassword(false)}
              error={isErrorPassword}
              icon={<AiOutlineLock />}
              isRequired={true}
              label={'Confirm Current Password'}
              onChange={handlePasswordChange}
              type={'password'}
              value={inputPassword}
            />
          </div>
          <Button
            variant="contained"
            disabled={disabled}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default DeleteAccount;
