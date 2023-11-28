import { useQuery } from "@apollo/react-hooks";
import GetCurrentUser from "@/app/graphql/queries/GetCurrentUser";

/**
 * User is a component that represents the current user and displays their information.
 */
const User = () => {
  const { loading, error, data } = useQuery(GetCurrentUser);

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
