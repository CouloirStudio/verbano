import styles from '../styles/login.module.scss';
import {useState} from 'react';
import {useMutation} from "@apollo/client";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loginUser, {loading, error}] = useMutation(LOGIN_USER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {data} = loginUser({
        variables: {
          email: username,
          password: password
        }
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }

    console.log('Logging in with', username, password);
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
    </div>
  );
};

export default LoginPage;
