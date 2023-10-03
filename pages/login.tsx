import styles from '../styles/login.module.scss';
import {useState} from 'react';
import {useMutation} from '@apollo/client';
import EmailField from '../app/components/Login/EmailField';

import PasswordField from '@/app/components/Login/PasswordField';
import {ErrorModalContextProvider, useErrorModalContext,} from '@/app/contexts/ErrorModalContext';
import ErrorModal from '@/app/components/ErrorModal';
import {Button, Divider} from '@mui/material';
import {FaGoogle} from 'react-icons/fa';

import {CURRENT_USER_QUERY} from '../app/graphql/queries/getUsers';
import {LOGIN_MUTATION} from '../app/graphql/mutations/addUsers';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useMutation(LOGIN_MUTATION, {
    update: (cache, {data: {login}}) =>
      cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: {currentUser: login.user},
      }),
  });

  const {setIsError, setErrorMessage} = useErrorModalContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      email: username,
      password: password,
    };

    try {
      const result = await login({variables: user});
      console.log(result);

      // TODO: Redirect to home page, but safely, maybe with the router or something. Don't really know how to do it.
      window.location.href = '/';
    } catch (e: any) {
      console.log(e);
      setErrorMessage(e.message || 'An unknown error occurred');
      setIsError(true);
    }
  };

  return (
    <ErrorModalContextProvider>
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <h1>Login</h1>
          <p>
            Don't have an account? <a href={'/register'}>Register here!</a>
          </p>
          <Divider variant="middle"/>
          <Button
            sx={{
              backgroundColor: '#de5246',
              '&:hover': {
                backgroundColor: '#de5246',
              },
            }}
            startIcon={<FaGoogle/>}
            variant="contained"
            color="primary"
            onClick={() => {
              window.location.href = 'http://localhost:3000/auth/google';
            }}
          >
            Login with Google
          </Button>
          <Divider variant="middle"/>

          <div className={styles.loginForm}>
            <ErrorModal/>

            <form onSubmit={handleSubmit}>
              <EmailField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
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
        </div>
      </div>
    </ErrorModalContextProvider>
  );
};

export default LoginPage;
