import { useUser } from '@/app/contexts/UserContext';
import { useMutation } from '@apollo/client';
import UpdateUser from '@/app/graphql/mutations/UpdateUser.graphql';

const useSettingsManager = () => {
  const currentUser = useUser();
  const [updateUser] = useMutation(UpdateUser);
  const updateEmail = async (newEmail: string) => {
    try {
      if (currentUser.email && currentUser.email === newEmail) return 'same';
      else {
        await updateUser({
          variables: {
            id: currentUser.id,
            input: {
              email: newEmail,
            },
          },
        });
        currentUser.email = newEmail;
        // need to trigger refresh somehow
        return 'success';
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
        const fullName = currentUser.firstName.concat(currentUser.lastName);
        const newFullName = newFirst.concat(newLast);

        if (fullName == newFullName) return 'same';
        else {
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

          return 'success';
        }
      } catch (error) {
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
