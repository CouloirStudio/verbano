import styles from '../styles/login.module.scss';
import {useState} from 'react';
import {useMutation} from '@apollo/client';
import GoogleButton from 'react-google-button';
import EmailField from "../app/components/Login/EmailField";

import {CURRENT_USER_QUERY} from '../app/middleware/queries';
import {LOGIN_MUTATION} from '../app/middleware/mutations';
import PasswordField from "@/app/components/Login/PasswordField";
import {ErrorModalContextProvider, useErrorModalContext} from "@/app/contexts/ErrorModalContext";
import ErrorModal from "@/app/components/ErrorModal";

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
    } catch (e: any) {
      setErrorMessage(e.message || 'An unknown error occurred');
      setIsError(true);
    }
  };

  return (
    <ErrorModalContextProvider>
      <div className={styles.container}>
        <div className={styles.loginForm}>

          <ErrorModal/>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>

            <EmailField value={username} onChange={(e) => setUsername(e.target.value)}/>
            <PasswordField value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Login</button>
          </form>

        </div>
        <GoogleButton
          onClick={() => {
            window.open('http://localhost:3000/auth/google');
          }}
        />
      </div>
    </ErrorModalContextProvider>
  );
};

export default LoginPage;
