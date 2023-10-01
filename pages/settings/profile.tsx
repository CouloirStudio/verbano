import bcrypt from 'bcryptjs';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { CURRENT_USER_QUERY } from '../../app/graphql/queries/getUsers';
import styles from '../../styles/globalSettings.module.scss';
import classes from '../../styles/globalSettings.module.scss';
import { UPDATE_FULL_NAME_MUTATION } from '../../app/graphql/mutations/addSettings';
import UpdateEmailField from '@/app/components/Settings/UpdateEmailField';
import UpdateFullName from '@/app/components/Settings/UpdateFullNameField';
import { SettingsSidebar } from '@/app/components/Settings/SettingsSidebar';
import UpdatePasswordField from '@/app/components/Settings/UpdatePasswordField';

// Define an interface for the expected shape of the currentUser data
interface CurrentUserData {
  currentUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  } | null;
}

const Profile = () => {
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState(''); // Store the hashed password
  const [currentPassword, setCurrentPassword] = useState('');

  const { loading, error, data } =
    useQuery<CurrentUserData>(CURRENT_USER_QUERY);

  // Use the useMutation hook to define the update function for your mutation
  const [updateFullName] = useMutation(UPDATE_FULL_NAME_MUTATION, {
    // Define the update function to update the cache
    update: (cache, { data: { updateFullName } }) => {
      // Read the current user's data from the cache
      const userData = cache.readQuery<CurrentUserData>({
        query: CURRENT_USER_QUERY,
      });

      if (userData && userData.currentUser) {
        // Update the user's first name and last name in the cache
        userData.currentUser.firstName = updateFullName.firstName;
        userData.currentUser.lastName = updateFullName.lastName;

        // Write the updated data back to the cache
        cache.writeQuery({
          query: CURRENT_USER_QUERY,
          data: userData,
        });
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

  // Function to handle full name change
  const handleFullNameChange = async () => {
    try {
      if (data && data.currentUser && data.currentUser.email) {
        // Update state variables with new values
        setFirstName(firstName); // Make sure firstName, lastName, and email are updated.
        setLastName(lastName);
        setEmail(email);

        const result = await updateFullName({
          variables: {
            email: email,
            firstName: firstName,
            lastName: lastName,
          },
        });

        // Handle the result, e.g., show a success message or update state
        if (result && result.data && result.data.updateFullName) {
          const updatedUser = result.data.updateFullName;
          setFirstName(updatedUser.firstName); // Update local state
          setLastName(updatedUser.lastName);
          setEmail(updatedUser.email);
          alert('Full name updated successfully!');
        } else {
          alert('Full name update failed.');
        }
      } else {
        // Handle the case where data or currentUser is undefined
        alert('User data is missing');
      }
    } catch (error) {
      // Log the specific error to the console
      alert(error);
      // Display an error message to the user
      // alert('An error occurred while updating your full name');
      // alert(error);
    }
  };

  // Function to handle password change
  // const handlePasswordChange = async (e: { preventDefault: () => void; }) => {
  //     e.preventDefault();
  //
  //     // Use bcrypt to compare the entered current password with the stored hashed password
  //     bcrypt.compare(currentPassword, hashedPassword, (err: Error, result: string) => {
  //         if (err) {
  //             // Handle error
  //             alert('An error occurred while checking the password.');
  //         } else if (result) {
  //             // Passwords match, allow the user to update the password
  //             // Implement logic to update the password here (e.g., using a mutation)
  //             alert('Password updated successfully!');
  //         } else {
  //             // Passwords do not match, display an error message
  //             alert('Current password is incorrect');
  //         }
  //     });
  // };
  //
  // if (loading) {
  //     return <p>Loading...</p>;
  // }
  //
  // if (error) {
  //     console.error('Error fetching user data:', error);
  //     return <p>Error fetching data</p>;
  // }

  return (
    <div className={styles.container}>
      <SettingsSidebar />
      <div className={classes.infoContainer}>
        {/*<p>*/}
        {/*    {currentPassword}*/}
        {/*</p>*/}
        {/*<p>*/}
        {/*    Hashed pass: {hashedPassword}*/}
        {/*</p>*/}
        <Typography variant="h4" className={styles.h1Tag}>
          Profile
        </Typography>
        <Typography variant="subtitle1" className={classes.subtitle1}>
          Manage your profile settings for Verbano
        </Typography>
        <section>
          {/*<form onSubmit={handlePasswordChange}>*/}
          <form onSubmit={handleFullNameChange}>
            <UpdateFullName
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <UpdateEmailField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/*<Typography*/}
            {/*    variant="subtitle1"*/}
            {/*    className={classes.subtitle1}>*/}
            {/*    Update your password*/}
            {/*</Typography>*/}
            {/*<UpdatePasswordField*/}
            {/*    value={currentPassword}*/}
            {/*    onChange={(e) => setCurrentPassword(e.target.value)}*/}
            {/*    text="Current Password"*/}
            {/*/>*/}
            {/*<UpdatePasswordField*/}
            {/*    value={newPassword}*/}
            {/*    onChange={(e) => setNewPassword(e.target.value)}*/}
            {/*    text="New Password"*/}
            {/*/>*/}
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
