import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { IUser } from '@/app/models/User';
import { Button } from '@mui/material';
import InputField from '../../Authentication/Login/InputField';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import CheckCurrentPassword from '@/app/graphql/queries/CheckCurrentPassword.graphql';
import DeleteUserAccount from '@/app/graphql/mutations/DeleteUserAccount.graphql';

interface DeleteAccountProps {
  currentUser: Partial<IUser>;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ currentUser }) => {
  const [disabled, setIsDisabled] = useState(true);
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const [checkPassword, { data }] = useLazyQuery(CheckCurrentPassword);
  const [deleteUserAccount] = useMutation(DeleteUserAccount);

  useEffect(() => {
    if (data) {
      // Check if the entered email and password match the server response
      const isEmailValid = inputEmail === currentUser.email;
      const isPasswordValid = data.checkCurrentPassword;

      // Enable the delete account button if both email and password are valid
      setIsDisabled(!(isEmailValid && isPasswordValid));
    }
  }, [data, inputEmail, currentUser.email]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
    // Trigger the checkPassword query when the password is changed
    checkPassword({
      variables: {
        email: currentUser.email,
        password: e.target.value,
      },
    });
  };

  const handleDeleteAccount = async () => {
    try {
      // Use the deleteUserAccount mutation to delete the user account
      await deleteUserAccount({
        variables: {
          email: currentUser.email,
        },
      });

      // Handle successful deletion, e.g., redirect, display a message, etc.
      console.log('User account deleted successfully');
      alert('User account deleted successfully');
      window.location.href = '/logout';
    } catch (error) {
      console.error('Error deleting user account:', error);
      alert('Account not deleted');
    }
  };

  return (
    <>
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

      <Button
        variant="contained"
        disabled={disabled}
        onClick={handleDeleteAccount}
      >
        Delete Account
      </Button>
    </>
  );
};

export default DeleteAccount;
