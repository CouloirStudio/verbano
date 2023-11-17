import React, { useState, useEffect } from 'react';
import { IUser } from '@/app/models/User';
import { Button } from '@mui/material';
import InputField from '../../Authentication/Login/InputField';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';

interface DeleteAccountProps {
	currentUser: Partial<IUser>;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ currentUser }) => {
	const [disabled, setIsDisabled] = useState(true);
	const [isErrorEmail, setIsErrorEmail] = useState(false);
	const [isErrorPassword, setIsErrorPassword] = useState(false);
	const [inputEmail, setInputEmail] = useState('');
	const [inputPassword, setInputPassword] = useState('');

	useEffect(() => {
		// Check if the entered email and password match the predefined values
		const isEmailValid = inputEmail === currentUser.email;
		const isPasswordValid = inputPassword === 'password';

		// Enable the delete account button if both email and password are valid
		setIsDisabled(!(isEmailValid && isPasswordValid));

		// Set errors for each field individually
		setIsErrorEmail(!isEmailValid);
		setIsErrorPassword(!isPasswordValid);
	}, [inputEmail, inputPassword]);

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputEmail(e.target.value);
		setIsErrorEmail(false); // Clear error when user types
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputPassword(e.target.value);
		setIsErrorPassword(false); // Clear error when user types
	};

	const handleDeleteAccount = () => {
		// Perform the delete account logic here
		console.log('Deleting account...');
	};

	return (
		<>
			<InputField
				clearError={() => setIsErrorEmail(false)}
				error={isErrorEmail}
				icon={<AiOutlineMail />}
				isRequired={true}
				label={'Confirm Current Email'}
				onChange={handleEmailChange}
				type={'text'}
				value={inputEmail}
			/>
			<br />
			<InputField
				clearError={() => setIsErrorPassword(false)}
				error={isErrorPassword}
				icon={<AiOutlineLock />}
				isRequired={true}
				label={'Confirm Current Password'}
				onChange={handlePasswordChange}
				type={'password'}
				value={inputPassword}
			/>

			<Button variant="contained" disabled={disabled} onClick={handleDeleteAccount}>
				Delete Account
			</Button>
		</>
	);
};

export default DeleteAccount;
