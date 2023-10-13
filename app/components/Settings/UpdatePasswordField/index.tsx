import React, { ChangeEvent, useState } from 'react';
import InputField from '@/app/components/Login/InputField';
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
  value,
  onChange,
  text,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Basic password validation example
    if (e.target.value.length < 8) {
      setError('Password should be at least 8 characters long.');
    } else {
      setError(null);
    }

    onChange(e);
  };

  return (
    <div>
      <InputField label={text} icon={<AiOutlineLock />}>
        <input type="password" value={value} onChange={handleInputChange} />
      </InputField>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UpdatePasswordField;
