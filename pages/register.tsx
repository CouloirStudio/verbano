import styles from '../styles/login.module.scss';
import {useState} from 'react';
import {useMutation} from "@apollo/client";
import {gql} from "apollo-boost";
import GoogleButton from 'react-google-button'

const SIGNUP_MUTATION = gql`
    mutation Signup($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
        signup(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
            user {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

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
      lastName
    }

    try {
      const result = await signup({variables: user});
      console.log(result);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Register</button>
        </form>
      </div>
      <GoogleButton
        label="Register with Google"
        onClick={() => {
          // The URL may need adjustment based on the registration endpoint for Google Auth
          window.open("http://localhost:3000/auth/google");
        }}
      />
    </div>
  );
};

export default RegisterPage;
