import styles from '../styles/login.module.scss';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, CircularProgress, Divider } from '@mui/material';
import { FaGoogle } from 'react-icons/fa';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';

import { CURRENT_USER_QUERY } from '../app/graphql/queries/getUsers';
import { LOGIN_MUTATION } from '../app/graphql/mutations/addUsers';

import InputField from '@/app/components/Login/InputField';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [login] = useMutation(LOGIN_MUTATION, {
    update: (cache, { data: { login } }) =>
      cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: { currentUser: login.user },
      }),
  });

  // ***** IMPORTANT ******
  // You may notice that when entering the wrong credentials, the page does a fast refresh, this is due to
  // the conditional statement within the component. If we decide we don't like it, remove the conditional that renders
  // <CircularProgress/> and the fast refresh will go away.

  const clearError = () => {
    setIsError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      email: username,
      password: password,
    };

    try {
      setIsRedirecting(true);
      await login({ variables: user });

      // TODO: Redirect to home page, but safely, maybe with the router or something. Don't really know how to do it.
      window.location.href = '/';
    } catch (e: any) {
      setIsRedirecting(false);
      setIsError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        {isRedirecting ? (
          <CircularProgress />
        ) : (
          <>
            <h1>Login</h1>
            <p>
              Don't have an account? <a href={'/register'}>Register here!</a>
            </p>
            <Divider variant="middle" />
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
              Login with Google
            </Button>
            <Divider variant="middle" />
            <div className={styles.loginForm}>
              <form onSubmit={handleSubmit}>
                {/*Username Field*/}
                <div data-cy="username-input-field">
                  <InputField
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isRequired={true}
                    label={'Username'}
                    type={'text'}
                    icon={<AiOutlineUser />}
                    error={isError}
                    clearError={clearError}
                  />
                </div>

                {/*Password Field*/}
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
                {isError ? <p>Incorrect Email or Password</p> : null}
                <Button
                  id={'loginButton'}
                  sx={{
                    width: '100%',
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
