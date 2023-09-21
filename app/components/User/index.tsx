import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

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

const User = () => {
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  const isLoggedIn = data?.currentUser;
  if (isLoggedIn) {
    const { id, firstName, lastName, email } = data.currentUser;
    return (
      <>
        {id}
        <br />
        {firstName} {lastName}
        <br />
        {email}
      </>
    );
  }
  // SIGNUP AND LOGIN GO HERE
  return <div>User is not logged in</div>;
};

export default User;
