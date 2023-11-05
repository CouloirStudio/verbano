import { useUser } from '@/app/contexts/UserContext';
import { useMutation } from '@apollo/client';
import UpdateUser from '@/app/graphql/mutations/UpdateUser.graphql';

const useSettingsManager = () => {
  const currentUser = useUser();
  const [updateUser] = useMutation(UpdateUser);
  const updateEmail = async (newEmail: string) => {
    try {
      // Check to see if value has actually changed.
      if (currentUser.email && currentUser.email === newEmail) return 'same';
      else {
        // Update the user
        await updateUser({
          variables: {
            id: currentUser.id,
            input: {
              email: newEmail,
            },
          },
        });
        // TODO: Need to trigger a refresh somehow to display new information
        return 'success, log back in for changes to take effect. ';
      }
    } catch (error) {
      return 'something went wrong';
    }
  };

  const updateName = async (newFirst: string, newLast: string) => {
    // Check to make sure that current user is not undefined
    if (
      currentUser.lastName !== undefined &&
      currentUser.firstName !== undefined
    ) {
      try {
        const fullName = currentUser.firstName + currentUser.lastName;
        const newFullName = newFirst + newLast;
        // Check to see if anything has changed
        if (fullName == newFullName) return 'same';
        else {
          // Update first name if it has changed
          if (currentUser.firstName !== newFirst) {
            await updateUser({
              variables: {
                id: currentUser.id,
                input: {
                  firstName: newFirst,
                },
              },
            });
          }

          // Update last name if it has changed
          if (currentUser.lastName !== newLast) {
            await updateUser({
              variables: {
                id: currentUser.id,
                input: {
                  lastName: newLast,
                },
              },
            });
          }
          // TODO: Need to trigger a refresh somehow to display new information
          return 'success, log back in for changes to take effect. ';
        }
      } catch (error) {
        console.log(error);
        return 'something went wrong';
      }
    } else return 'something went wrong';
  };

  return {
    updateEmail,
    updateName,
  };
};

export default useSettingsManager;
