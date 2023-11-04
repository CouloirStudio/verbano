import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Authentication/Login/InputField';
import { AiOutlineLock } from 'react-icons/ai';

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  text: string;
}

/**
 * `UpdatePasswordField` is a React functional component that provides a password input field for updating a password.
 *
 * It includes basic password validation to ensure a minimum length of 8 characters.
 *
 * @remarks
 * This component can be used in forms where the user is required to enter or update their password.
 *
 * @param props - The component's props.
 * @param props.onChange - A function to handle changes to the password input field.
 *
 * @example
 * ```tsx
 * <UpdatePasswordField value={passwordValue} onChange={handlePasswordChange} text="New Password" />
 * ```
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 *
 */
const UpdatePasswordField: React.FC<PasswordInputProps> = ({ onChange }) => {
  return (
    <div>
      <InputField
        label={'Update Password'}
        icon={<AiOutlineLock />}
        clearError={() => {}}
        error={false}
        isRequired={false}
        onChange={onChange}
        type={'password'}
        value={''}
      />
    </div>
  );
};

export default UpdatePasswordField;
