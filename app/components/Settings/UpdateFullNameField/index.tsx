import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Login/InputField';
import { AiOutlineUser } from 'react-icons/ai';

interface FullNameInputProps {
  firstName: string;
  lastName: string;
  firstLabel: string;
  secondLabel: string;
  onFirstNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
/**
 * `UpdateFullName` is a React functional component that provides input fields for updating a user's first name and last name with customizable labels.
 *
 * @remarks
 * This component is designed for use in forms where a user can update their full name. It allows you to customize the labels for the input fields.
 *
 * @param props - The component's props.
 * @param props.firstName - The current value of the first name input field.
 * @param props.lastName - The current value of the last name input field.
 * @param props.firstLabel - The label for the first name input field.
 * @param props.secondLabel - The label for the last name input field.
 * @param props.onFirstNameChange - A function to handle changes to the first name input field.
 * @param props.onLastNameChange - A function to handle changes to the last name input field.
 *
 * @example
 * ```tsx
 * <UpdateFullName
 *   firstName={firstNameValue}
 *   lastName={lastNameValue}
 *   firstLabel="First Name"
 *   secondLabel="Last Name"
 *   onFirstNameChange={handleFirstNameChange}
 *   onLastNameChange={handleLastNameChange}
 * />
 * ```
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 */
const UpdateFullName: React.FC<FullNameInputProps> = ({
  firstName,
  lastName,
  firstLabel,
  secondLabel,
  onFirstNameChange,
  onLastNameChange,



}) => {
  return (
    <>
      {/* InputField with label and icon for first name */}
      <InputField label={firstLabel} icon={<AiOutlineUser />}>
        <input
          type="text"
          value={firstName}
          onChange={onFirstNameChange}
          required
        />
      </InputField>

      {/* InputField with label and icon for last name */}
      <InputField label={secondLabel} icon={<AiOutlineUser />}>
        <input
          type="text"
          value={lastName}
          onChange={onLastNameChange}
          required
        />
      </InputField>
    </>
  );
};

export default UpdateFullName;
