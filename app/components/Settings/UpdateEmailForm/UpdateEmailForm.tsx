import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Authentication/Login/InputField';
import { AiOutlineMail } from 'react-icons/ai';

interface EmailInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * `UpdateEmailField` is a React functional component that provides an input field for updating a user's email address.
 *
 * @remarks
 * This component is designed for use in forms where a user can update their email address.
 *
 * @param props - The component's props.
 * @param props.value - The current value of the email input field.
 * @param props.onChange - A function to handle changes to the email input field.
 *
 * @example
 * ```tsx
 * <UpdateEmailField value={emailValue} onChange={handleEmailChange} />
 * ```
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 *
 */
const UpdateEmailForm: React.FC<EmailInputProps> = ({ value, onChange }) => {
  return (
    <form>
      <InputField
        label="Update Email"
        icon={<AiOutlineMail />}
        clearError={() => {}}
        error={false}
        isRequired={true}
        onChange={onChange}
        type={'email'}
        value={value}
      />
    </form>
  );
};

export default UpdateEmailForm;
