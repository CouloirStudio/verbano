import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import styles from '../../styles/globalSettings.module.scss';
import classes from '../../styles/globalSettings.module.scss';
import { CURRENT_USER_QUERY } from '@/app/graphql/queries/getUsers';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import UpdateEmailField from '@/app/components/Settings/UpdateEmailField/index';
import UpdateFullName from '@/app/components/Settings/UpdateFullNameField';
import { SettingsSidebar } from '@/app/components/Settings/SettingsSidebar';
import UpdatePasswordField from '@/app/components/Settings/UpdatePasswordField';
import {
  UPDATE_FULL_NAME_MUTATION,
  UPDATE_EMAIL_MUTATION,
  UPDATE_PASSWORD_MUTATION
} from '@/app/graphql/mutations/addSettings';
import CurrentUserData from './interface/CurrentUserData';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState(''); // Store the hashed password
  const [currentPassword, setCurrentPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);


  const { setErrorMessage, setIsError } = useErrorModalContext();

  const { loading, error, data, refetch } = useQuery<CurrentUserData>(
    CURRENT_USER_QUERY,
    {
      onError: (error) => {
        // Handle errors from the query
        console.error('Error fetching user data:', error.message);
        setErrorMessage(error.message); // Set the error message from the error context
        setIsError(true);
      },
    },
  );

  const [updateEmail] = useMutation(UPDATE_EMAIL_MUTATION, {
    onError: (error) => {
      console.error('Error updating email', error.message);
      setErrorMessage(error.message);
      setIsError(true);
    },
    update: (cache, { data: { updateEmail } }) => {
      console.log('Received updated email data: ', updateEmail);

      const userData = cache.readQuery<CurrentUserData>({
        query: CURRENT_USER_QUERY,
      });

      console.log('Current cache data: ', userData)

      if (userData && userData.currentUser) {

        const updatedUserData = {
          ...userData,
          currentUser: {
            ...userData.currentUser,
            email: updateEmail.email
          },
        };

        cache.writeQuery({
          query: CURRENT_USER_QUERY,
          data: updatedUserData,
        })
        console.log('Updated cache data:', userData);
      }
    },
  });

  const [updateFullName] = useMutation(UPDATE_FULL_NAME_MUTATION, {
    onError: (error) => {
      // Handle errors from the mutation
      console.error('Error updating full name:', error.message);
      setErrorMessage(error.message);
      setIsError(true);
    },
    // Define the update function to update the cache
    update: (cache, { data: { updateFullName } }) => {
      console.log('Received updateFullName data:', updateFullName);

      const userData = cache.readQuery<CurrentUserData>({
        query: CURRENT_USER_QUERY,
      });

      console.log('Current cache data:', userData);

      if (userData && userData.currentUser) {
        // Create a deep copy of the user data
        const updatedUserData = {
          ...userData,
          currentUser: {
            ...userData.currentUser,
            firstName: updateFullName.firstName,
            lastName: updateFullName.lastName,
          },
        };

        cache.writeQuery({
          query: CURRENT_USER_QUERY,
          data: updatedUserData,
        });
        console.log('Updated cache data:', userData);
      }
    },
  });

  // Use useEffect to initialize state once when the component mounts
  useEffect(() => {
    if (!loading && !error && data && data.currentUser) {
      const currentUser = data.currentUser;
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setEmail(currentUser.email);
      setFullName(`${currentUser.firstName} ${currentUser.lastName}`);
      setHashedPassword(currentUser.password); // Store the hashed password
    }
  }, [loading, error, data]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (data && data.currentUser) {
        const updates: { email?: string; firstName?: string; lastName?: string } = {};

        // Always update the email field if it's different
        if (email !== data.currentUser.email) {
          updates.email = email;
        }

        // Update first name and last name if either is different
        if (firstName !== data.currentUser.firstName || lastName !== data.currentUser.lastName) {
          updates.firstName = firstName;
          updates.lastName = lastName;
        }

        // Check if any updates are pending
        if (Object.keys(updates).length > 0) {
          // Perform the email update first
          let updatedEmail = email;
          if (updates.email) {
            const resultEmail = await updateEmail({
              variables: {
                email: data.currentUser.email,
                newEmail: email,
              },
            });
            if (resultEmail && resultEmail.data && resultEmail.data.updateEmail) {
              updatedEmail = resultEmail.data.updateEmail.email;
            } else {
              setErrorMessage('Email update failed.');
              setIsError(true);
              //return;
            }
          }

          // Perform the full name update if needed
          if (updates.firstName || updates.lastName) {
            const resultFullName = await updateFullName({
              variables: {
                email: updatedEmail, // Use the updated email value here
                firstName: firstName,
                lastName: lastName,
              },
            });
            if (resultFullName && resultFullName.data && resultFullName.data.updateFullName) {
              // Update the state with the new data
              const updatedUserFullName = resultFullName.data.updateFullName;
              setFirstName(updatedUserFullName.firstName);
              setLastName(updatedUserFullName.lastName);
              setEmail(updatedEmail); // Use the updated email value here

              // Set a success message
              setSuccessMessage('Changes saved successfully!');
              setIsSuccess(true);

              // Fetch the updated user data to ensure it's up-to-date
              await refetch(); // Add this line to refetch the user data
            } else {
              setErrorMessage('Full name update failed.');
              setIsError(true);
            }
          } else {
            // If only email was updated, set success message and refetch
            setSuccessMessage('Changes saved successfully!');
            setIsSuccess(true);
            await refetch();
          }
        } else {
          // No updates were made
          setSuccessMessage('No changes were made.');
          setIsSuccess(true);
        }
      } else {
        setErrorMessage('User data is missing.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while updating your information.');
      setIsError(true);
    }
  };

  return (
    <div className={styles.container}>
      <SettingsSidebar />
      <div className={classes.infoContainer}>
        <Typography variant="h4" className={styles.h1Tag}>
          Profile
        </Typography>
        <Typography variant="subtitle1" className={classes.subtitle1}>
          Manage your profile settings for Verbano
        </Typography>
        <section>
          {/*<form onSubmit={handlePasswordChange}>*/}
          <form onSubmit={handleFormSubmit}>
            <UpdateFullName
              firstName={firstName}
              lastName={lastName}
              firstLabel={'Update First Name'}
              secondLabel={'Update Last Name'}
              onFirstNameChange={(e) => setFirstName(e.target.value)}
              onLastNameChange={(e) => setLastName(e.target.value)}
            />

            <UpdateEmailField
              value={email}
              label={'Update Email'}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography
                variant="subtitle1"
                className={classes.subtitle1}>
                Update your password
            </Typography>
            <button type="submit" className={classes.updateButton}>
              Save Changes
            </button>
          </form>
          <h3>Danger Zone</h3>
          <button className={classes.deleteAccountButton}>
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default Profile;
