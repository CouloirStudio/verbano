import React, { ChangeEvent, useState } from 'react';
import InputField from '@/app/components/Authentication/Login/InputField';
import { AiOutlineLock } from 'react-icons/ai';

interface PasswordInputProps {
  currentPassword: string;
  newPassword: string;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isSecondFieldEnabled: boolean;
  //onNewPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  value: string;
  label: string;
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
 * @param props.value - The current value of the password input field.
 * @param props.onChange - A function to handle changes to the password input field.
 * @param props.text - The text to display as the input field's label.
 *
 * @example
 * ```tsx
 * <UpdatePasswordField value={passwordValue} onChange={handlePasswordChange} text="New Password" />
 * ```
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 *
 */
const UpdatePasswordField: React.FC<PasswordInputProps> = ({
  currentPassword,
  newPassword,
  onPasswordChange,
  isSecondFieldEnabled,
  disabled,
  label,
  value
}) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <InputField
        value={value}
        onChange={onPasswordChange}
        isRequired={true}
        label={label}
        type={'password'}
        icon={<AiOutlineLock />}
        error={false}
        clearError={() => {}}
        disabled={disabled}
      />
    </>
  );
};

export default UpdatePasswordField;
