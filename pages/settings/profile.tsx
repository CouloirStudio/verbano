import Typography from '@mui/material/Typography';
import React, {useEffect, useState} from 'react';
import {useMutation} from '@apollo/client';

import styles from '../../styles/globalSettings.module.scss';
import classes from '../../styles/globalSettings.module.scss';
import {CURRENT_USER_QUERY} from '@/app/graphql/queries/getUsers';
import {useErrorModalContext} from '@/app/contexts/ErrorModalContext';
import UpdateEmailField from '@/app/components/Settings/UpdateEmailField/index';
import UpdateFullName from '@/app/components/Settings/UpdateFullNameField';
import {SettingsSidebar} from '@/app/components/Settings/SettingsSidebar';
import {UPDATE_EMAIL_MUTATION, UPDATE_FULL_NAME_MUTATION,} from '@/app/graphql/mutations/addSettings';
import {useUser} from "@/app/components/UserProvider";

const Profile = () => {
  const currentUser = useUser();
  const {setErrorMessage, setIsError} = useErrorModalContext();

  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState(currentUser?.password || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [updateEmail] = useMutation(UPDATE_EMAIL_MUTATION, {
    onError: (error) => {
      console.error('Error updating email', error.message);
      setErrorMessage(error.message);
      setIsError(true);
    },
    update: (cache, {data: {updateEmail}}) => {
      if (currentUser) {
        const updatedUserData = {
          ...currentUser,
          email: updateEmail.email,
        };
        cache.writeQuery({query: CURRENT_USER_QUERY, data: {currentUser: updatedUserData}});
      }
    },
  });

  const [updateFullName] = useMutation(UPDATE_FULL_NAME_MUTATION, {
    onError: (error) => {
      console.error('Error updating full name:', error.message);
      setErrorMessage(error.message);
      setIsError(true);
    },
    update: (cache, {data: {updateFullName}}) => {
      if (currentUser) {
        const updatedUserData = {
          ...currentUser,
          firstName: updateFullName.firstName,
          lastName: updateFullName.lastName,
        };
        cache.writeQuery({query: CURRENT_USER_QUERY, data: {currentUser: updatedUserData}});
      }
    },
  });

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setEmail(currentUser.email || '');
      setHashedPassword(currentUser.password || '');
    }
  }, [currentUser]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUser) {
      setErrorMessage('User data is missing.');
      setIsError(true);
      return;
    }

    try {
      const updates: {
        email?: string;
        firstName?: string;
        lastName?: string;
      } = {};

      if (email !== currentUser.email) {
        updates.email = email;
      }

      if (firstName !== currentUser.firstName || lastName !== currentUser.lastName) {
        updates.firstName = firstName;
        updates.lastName = lastName;
      }

      if (Object.keys(updates).length > 0) {
        if (updates.email) {
          await updateEmail({
            variables: {
              email: currentUser.email,
              newEmail: email,
            },
          });
        }

        if (updates.firstName || updates.lastName) {
          await updateFullName({
            variables: {
              email: currentUser.email, // Use the original email value here
              firstName: firstName,
              lastName: lastName,
            },
          });
        }

        setSuccessMessage('Changes saved successfully!');
        setIsSuccess(true);
      } else {
        setSuccessMessage('No changes were made.');
        setIsSuccess(true);
      }

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while updating your information.');
      setIsError(true);
    }
  };


  return (
    <div className={styles.container}>
      <SettingsSidebar/>
      <div className={classes.infoContainer}>
        <Typography variant="h4" className={styles.h1Tag}>Profile</Typography>
        <Typography variant="subtitle1" className={classes.subtitle1}>Manage your profile settings for
          Verbano</Typography>
        <section>
          <form onSubmit={handleFormSubmit}>
            <UpdateFullName
              firstName={firstName}
              lastName={lastName}
              onFirstNameChange={(e) => setFirstName(e.target.value)}
              onLastNameChange={(e) => setLastName(e.target.value)}
            />
            <UpdateEmailField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="subtitle1" className={classes.subtitle1}>Update your password</Typography>
            <button type="submit" className={classes.updateButton}>Save Changes</button>
          </form>
          <h3>Danger Zone</h3>
          <button className={classes.deleteAccountButton}>Delete Account</button>
        </section>
      </div>
    </div>
  );
};

export default Profile;
