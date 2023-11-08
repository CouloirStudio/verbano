import { useUser } from "@/app/contexts/UserContext";
import { useMutation } from "@apollo/client";
import UpdateUser from "@/app/graphql/mutations/UpdateUser.graphql";
import UpdateUserPassword from "@/app/graphql/mutations/UpdatePassword.graphql";

/**
 * Manager for updating user settings
 */
const useSettingsManager = () => {
  const currentUser = useUser();
  const [updateUser] = useMutation(UpdateUser);
  const [updateUserPassword] = useMutation(UpdateUserPassword);

  /**
   * Function for updating user email
   * @param newEmail The new email address
   */
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
      console.log(error);
      if (error instanceof Error) return error.message;
      else return 'email update failed.';
    }
  };

  /**
   * Function for updating users name
   * @param newFirst The new first name
   * @param newLast The new last name
   */
  const updateName = async (newFirst: string, newLast: string) => {
    // Check to make sure that current user is not undefined
    try {
      if (
        currentUser.lastName !== undefined &&
        currentUser.firstName !== undefined
      ) {
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
      } else return 'something went wrong';
    } catch (error) {
      if (error instanceof Error) return error.message;
      else return 'Name update failed.';
    }
  };

  /**
   * Function for updating user password
   * @param oldPass The old user password for validation
   * @param newPass The new user password
   * @param newPassConfirm Confirmation of the new password
   */
  const updatePassword = async (
    oldPass: string,
    newPass: string,
    newPassConfirm: string,
  ) => {
    console.log(currentUser);
    // confirm password length
    if (!(newPass.split('').length >= 8))
      return 'Password must be more than 8 characters.';
    // confirm new password
    else if (newPass !== newPassConfirm) return 'Passwords do not match.';
    else {
      if (newPass == oldPass)
        return 'New password cannot be the same as old password';
      // pass rest of validation/ update to the resolver
      try {
        await updateUserPassword({
          variables: {
            id: currentUser.id,
            input: {
              oldPass: oldPass,
              newPass: newPass,
              newPassConfirm: newPassConfirm,
            },
          },
        });
        return 'Password changed successfully.';
      } catch (error) {
        console.log(error);
        if (error instanceof Error) return error.message;
        else return 'password update failed.';
      }
    }
  };

  return {
    updateEmail,
    updateName,
    updatePassword,
  };
};

export default useSettingsManager;
