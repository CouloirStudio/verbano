import styles from '../styles/login.module.scss';
import {useState} from 'react';
import {useMutation} from '@apollo/client';
import GoogleButton from 'react-google-button';

import {CURRENT_USER_QUERY} from '../app/middleware/queries';
import {LOGIN_MUTATION} from '../app/middleware/mutations';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      email: username,
      password: password,
    };

    const result = await login({variables: user});
    console.log(result);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit">Login</button>
        </form>
      </div>
      <GoogleButton
        onClick={() => {
          window.open('http://localhost:3000/auth/google');
        }}
      />
    </div>
  );
};

export default LoginPage;
