import React, {useEffect, useState} from 'react';
import {useApolloClient, useQuery} from "@apollo/react-hooks";
import CurrentUserData from "@/pages/settings/interface/CurrentUserData";
// @ts-ignore
import GetCurrentUser from "@/app/graphql/queries/GetCurrentUser";
import {useErrorModalContext} from "@/app/contexts/ErrorModalContext";
// @ts-ignore
import UpdatePassword from "@/app/graphql/mutations/UpdatePassword";
import {useMutation} from "@apollo/client";
import {useUser} from '@/app/contexts/UserContext';
import UpdatePasswordField from "@/app/components/Settings/UpdatePasswordField";
import {CHECK_CURRENT_PASSWORD_QUERY} from "@/app/graphql/queries/checkCurrentPassword";
import {Button, CircularProgress} from '@mui/material';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Stack from '@mui/material/Stack';
import Link from "next/link";

const Password = () => {
	// Access the error modal context for displaying error messages
	const {setErrorMessage, setIsError} = useErrorModalContext();

	const [newPassword, setNewPassword] = useState('');
	const [hashedPassword, setHashedPassword] = useState<string | undefined>(''); // Store the hashed password
	const [currentPassword, setCurrentPassword] = useState<string | undefined>('');
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [isSecondFieldEnabled, setIsSecondFieldEnabled] = useState(false);
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [formSuccessful, setFormSuccessful] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false);

	const client = useApolloClient();

	const [updatePassword] = useMutation(UpdatePassword, {
		onError: (error) => {
			console.error('Error updating password:', error.message);
			setErrorMessage(error.message);
			setIsError(true);
		},
		update: (cache, {data: {updatePassword}}) => {
			console.log('Recieved updatePassword data:', updatePassword);

			const userData = cache.readQuery<CurrentUserData>({
				query: GetCurrentUser,
			});

			console.log('Current cache data:', userData);

			if (userData && userData.currentUser) {
				// Create a deep copy of the user data
				const updatedUserData = {
					...userData,
					currentUser: {
						...userData.currentUser,
						password: updatePassword.password,
					},
				};
				cache.writeQuery({
					query: GetCurrentUser,
					data: updatedUserData,
				});
				console.log('Updated cache data:', userData);
			}
		}
	});

	const {loading, error, data, refetch} = useQuery<CurrentUserData>(
		GetCurrentUser,
		{
			onError: (error) => {
				// Handle errors from the query
				console.error('Error fetching user data:', error.message);
				setErrorMessage(error.message); // Set the error message from the error context
				setIsError(true);
			},
		},
	);

	const currentUser = useUser();


	const handleCurrentPasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPasswordValueTyped = e.target.value;
		setCurrentPassword(newPasswordValueTyped);

		// Check if the entered password is valid
		await checkCurrentPassword(newPasswordValueTyped);
	}

	const checkCurrentPassword = async (password: string) => {
		try {
			const {data: checkPasswordData} = await client.query({
				query: CHECK_CURRENT_PASSWORD_QUERY,
				variables: {
					email: currentUser.email,
					password: password, // Use the passed password
				},
			});
			if (checkPasswordData && checkPasswordData.checkCurrentPassword) {
				setIsPasswordValid(true);
			} else {
				setIsPasswordValid(false);
			}
		} catch (error) {
			console.error('Error checking current password:', error)
		}
	}
	const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewPassword(e.target.value);
	}

	const verifyNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmNewPassword(e.target.value);
	}

	useEffect(() => {
		if (!loading && !error && data && data.currentUser) {
			setHashedPassword(data.currentUser.password);
			// Check if the current password is valid
			checkCurrentPassword(data.currentUser.password);
		}
		if (formSuccessful) {
			setCurrentPassword(''); // Reset currentPassword to an empty string after a successful form submission
		}
	}, [loading, error, data, formSuccessful]);

	useEffect(() => {
		// Set isSecondFieldEnabled based on isPasswordValid
		if (isPasswordValid) {
			setIsSecondFieldEnabled(true);
		} else {
			setIsSecondFieldEnabled(false);
		}
	}, [isPasswordValid]);


	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		//event.preventDefault();
		try {
			if (data && data.currentUser) {
				const updates: {
					password?: string;
					newPassword?: string;
				} = {};

				// Check if the password and new password fields are filled
				if (currentPassword && newPassword) {
					updates.password = currentPassword;
					updates.newPassword = newPassword;
				}

				// Check if any password updates are pending
				if (Object.keys(updates).length > 0) {
					// Get the current user's email
					const userEmail = data.currentUser.email;

					// Perform the password update
					const resultPassword = await updatePassword({
						variables: {
							email: userEmail,
							password: updates.password,
							newPassword: updates.newPassword,
						},
					});

					if (
						resultPassword &&
						resultPassword.data &&
						resultPassword.data.updatePassword
					) {
						setSuccessMessage('Password updated successfully!');
						setIsSuccess(true);
						setCurrentPassword('');
						setIsRedirecting(true)
						window.location.href = '/'

					} else {
						setErrorMessage('Password update failed.');
						setIsError(true);
					}
				} else {
					// No password updates were made
					setSuccessMessage('No password changes were made.');
					setIsSuccess(true);
				}
			} else {
				setErrorMessage('User data is missing.');
				setIsError(true);
			}
		} catch (error) {
			console.error('Error:', error);
			setErrorMessage('An error occurred while updating your password.');
			setIsError(true);
			setFormSuccessful(false);
		}
		setNewPassword('');
		setConfirmNewPassword('');
		setFormSuccessful(true)
	};
	return (
		<>
			<Link href={'/'}>Go Back</Link>
			{isRedirecting ? (
				<Stack sx={{width: '100%'}} spacing={2}>
					<Alert
						iconMapping={{
							success: <CheckCircleOutlineIcon fontSize="inherit"/>,
						}}
					>
						Password Updated Successfully!
					</Alert>
				</Stack>
			) : (
				<form onSubmit={handleFormSubmit}>
					<br/>
					<br/>
					<UpdatePasswordField
						value={currentPassword || ''}
						label={'Verify Current Password'}
						currentPassword={currentPassword || ''}
						newPassword={newPassword || ''}
						onPasswordChange={handleCurrentPasswordChange}
						isSecondFieldEnabled={isSecondFieldEnabled}
						disabled={false}
					/>
					<br/>
					<br/>
					<UpdatePasswordField
						value={newPassword || ''}
						label={'Enter New Password'}
						currentPassword={currentPassword || ''}
						newPassword={newPassword || ''}
						onPasswordChange={handleNewPasswordChange}
						isSecondFieldEnabled={isSecondFieldEnabled}
						disabled={!isSecondFieldEnabled}
					/>
					<br/>
					<UpdatePasswordField
						value={confirmNewPassword || ''}
						label={'Confirm New Password'}
						currentPassword={currentPassword || ''}
						newPassword={newPassword || ''}
						onPasswordChange={verifyNewPasswordChange}
						isSecondFieldEnabled={isSecondFieldEnabled}
						disabled={!isSecondFieldEnabled}
					/>
					<Button
						type={"submit"}
						variant="contained"
						disabled={(confirmNewPassword !== newPassword) || confirmNewPassword == ''}
					>
						Update Password
					</Button>
					{formSuccessful ? (
						<Stack sx={{width: '100%'}} spacing={2}>
							<Alert
								iconMapping={{
									success: <CheckCircleOutlineIcon fontSize="inherit"/>,
								}}
							>
								Password Updated Successfully!
							</Alert>
						</Stack>
					) : null}
				</form>
			)
			}
		</>
	);
}


export default Password;