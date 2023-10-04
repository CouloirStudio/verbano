import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Button, Divider } from '@mui/material';
import { FaGoogle } from 'react-icons/fa';
import styles from '../styles/register.module.scss';
import { SIGNUP_MUTATION } from '../app/graphql/mutations/addUsers';
import {
  ErrorModalContextProvider,
  useErrorModalContext,
} from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/ErrorModal';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsError, setErrorMessage } = useErrorModalContext();
  const router = useRouter();

  const [signup] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      console.log('Mutation completed:', data);
    },
    onError: (error) => {
      console.error('Apollo Error:', error);
    },
  });
  
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
      console.log(result);
      if (result.data && result.data.signup && result.data.signup.user) {
        // Optionally show a success message
        router.push('/login');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage(error.message || 'An unknown error occurred');
      setIsError(true);
    }
  };

  return (
    <ErrorModalContextProvider>
      <div className={styles.container}>
        <div className={styles.registerForm}>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <ErrorModal />
            <div className={styles.inputField}>
              <label>
                First Name:
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
            </div>
            <div className={styles.inputField}>
              <label>
                Last Name:
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
            <div className={styles.inputField}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div className={styles.inputField}>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <Button
              sx={{ width: '100%', marginBottom: '10px' }}
              variant="contained"
              color="primary"
              type="submit"
            >
              Register
            </Button>
            <Divider variant="middle" style={{ marginBottom: '20px' }} />
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
                window.open('http://localhost:3000/auth/google');
              }}
            >
              Register with Google
            </Button>
          </form>
        </div>
      </div>
    </ErrorModalContextProvider>
  );
};

export default RegisterPage;
