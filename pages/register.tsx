import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import styles from '../styles/register.module.scss';
import { SIGNUP_MUTATION } from '@/app/graphql/mutations/addUsers';
import EmailField from '../app/components/Settings/UpdateEmailField';
import PasswordField from '../app/components/Login/PasswordField';
import NameField from '../app/components/Settings/UpdateFullNameField';
import { Button, Divider } from '@mui/material';
import { FaGoogle } from 'react-icons/fa';
import ErrorModal from '@/app/components/ErrorModal';
import { useRouter } from 'next/router';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signup] = useMutation(SIGNUP_MUTATION);

  const router = useRouter();
  const { setIsError, setErrorMessage } = useErrorModalContext();

  useEffect(() => {
    const errorMessage = router.query.error;
    if (errorMessage) {
      setIsError(true);
      setErrorMessage(errorMessage as string);
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      email,
      password,
      firstName,
      lastName,
    };

    try {
      const result = await signup({ variables: user });
      await router.push('/login');
    } catch (error) {
      setErrorMessage(error.message || 'An unknown error occurred');
      setIsError(true);
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className={styles.container}>
      <ErrorModal />
      <div className={styles.registerContainer}>
        <h1>Register</h1>
        <p>
          Already have an account? <a href={'/login'}>Login here!</a>
        </p>
        <Divider variant={'middle'} />
        <Button
          sx={{
            backgroundColor: '#de5246',
            '&:hover': {
              backgroundColor: '#de5246',
            },
          }}
          startIcon={<FaGoogle />}
          variant="contained"
          color="primary"
          onClick={() => {
            window.location.href = 'http://localhost:3000/auth/google';
          }}
        >
          Register with Google
        </Button>
        <Divider variant={'middle'} />
        <form onSubmit={handleSubmit}>
          <div>
            <NameField
              firstName={firstName}
              lastName={lastName}
              onFirstNameChange={(e) => {
                setFirstName(e.target.value);
              }}
              onLastNameChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <div>
            <EmailField
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <PasswordField
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <Button
            id={'registerButton'}
            sx={{
              width: '100%',
            }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
