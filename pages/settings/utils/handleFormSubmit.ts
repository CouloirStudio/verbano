import { MutationFunction, QueryResult } from '@apollo/client';
import { setErrorMessageType, ReactFormEvent, setIsErrorType, setFirstNameType, setLastNameType, setEmailType, setSuccessMessageType, setIsSuccessType, refetchType } from '../types'; // Replace with appropriate types for these functions

const handleFormSubmit = async (
    event: ReactFormEvent<HTMLFormElement>,
    data: any,
    email: string,
    firstName: string,
    lastName: string,
    updateEmail: MutationFunction,
    updateFullName: MutationFunction,
    setErrorMessage: setErrorMessageType,
    setIsError: setIsErrorType,
    setFirstName: setFirstNameType,
    setLastName: setLastNameType,
    setEmail: setEmailType,
    setSuccessMessage: setSuccessMessageType,
    setIsSuccess: setIsSuccessType,
    refetch: refetchType
) => {
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
                        return;
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

export default handleFormSubmit;
