import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import styles from '../styles/register.module.scss';
import { SIGNUP_MUTATION } from '@/app/graphql/mutations/addUsers';
import { Button, Divider } from '@mui/material';
import { FaGoogle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import InputField from '@/app/components/Login/InputField';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [signup] = useMutation(SIGNUP_MUTATION);

  const router = useRouter();

  const clearError = () => {
    setIsError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      email,
      password,
      firstName,
      lastName,
    };

    try {
      await signup({ variables: user });
      await router.push('/login');
    } catch (error) {
      setIsError(true);
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className={styles.container}>
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
          {/* FirstNameField */}
          <div data-cy="firstname-input-field">
            <InputField
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              isRequired={true}
              label={'First Name'}
              type={'text'}
              icon={<AiOutlineLock />}
              error={isError}
              clearError={clearError}
            />
          </div>
          {/* LastNameField */}
          <div data-cy="lastname-input-field">
            <InputField
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              isRequired={true}
              label={'Last Name'}
              type={'text'}
              icon={<AiOutlineLock />}
              error={isError}
              clearError={clearError}
            />
          </div>

          {/* EmailField */}
          <div data-cy="email-input-field">
            <InputField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired={true}
              label={'Email'}
              type={'email'}
              icon={<AiOutlineLock />}
              error={isError}
              clearError={clearError}
            />
          </div>

          {/* Password Field */}
          <div data-cy="password-input-field">
            <InputField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired={true}
              label={'Password'}
              type={'password'}
              icon={<AiOutlineLock />}
              error={isError}
              clearError={clearError}
            />
          </div>
          {isError ? <p>Invalid Credentials</p> : null}
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
