import {gql} from "apollo-boost";
import {useMutation} from "@apollo/client";

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

const CURRENT_USER_QUERY = gql`
    query CurrentUserQuery {
        currentUser {
            id
            firstName
            lastName
            email
        }
    }
`;

const LoginWithCredentials = () => {

  const [login] = useMutation(
    LOGIN_MUTATION,
    {
      update: (cache, {data: {login}}) => cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: {currentUser: login.user},
      }),
    }
  );

  const user = {
    email: 'calebneuf@gmail.com',
    password: 'password',
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <label>
          Username:
          <input type="text"/>
        </label>
        <label>
          Password:
          <input type="password"/>
        </label>
        <button onClick={() => login({
          variables: user
        })}>Login
        </button>
      </form>
    </div>
  );
}

export default LoginWithCredentials;