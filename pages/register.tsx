import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import GoogleButton from 'react-google-button';
import styles from '../styles/register.module.scss';
import { SIGNUP_MUTATION } from '@/app/graphql/mutations/addUsers';
import EmailField from '../app/components/Settings/UpdateEmailField';
import PasswordField from '../app/components/Login/PasswordField';
import NameField from '../app/components/Settings/UpdateFullNameField';
import {Button, Divider} from '@mui/material';
import {FaGoogle} from "react-icons/fa";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signup] = useMutation(SIGNUP_MUTATION);

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
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerContainer}>
        <h1>Register</h1>
        <p>Already have an account?{' '}
          <a href={'/login'}>
            Login here!
          </a>
        </p>
        <Divider variant={'middle'}/>
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
                  firstLabel={'First Name'}
                  secondLabel={'Last Name'}
                  onFirstNameChange={e => {setFirstName(e.target.value)}}
                  onLastNameChange={e => {setLastName(e.target.value)}}
              />
          </div>
          <div>
              <EmailField
                  value={email}
                  label={'Email'}
                  onChange={e => {setEmail(e.target.value)}}
              />
          </div>
          <div>
              <PasswordField
                  value={password}
                  onChange={e => {setPassword(e.target.value)}}
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
