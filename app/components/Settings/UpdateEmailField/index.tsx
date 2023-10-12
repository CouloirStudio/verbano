import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Login/InputField';
import { AiOutlineMail } from 'react-icons/ai';

/**
 * `UpdateEmailField` is a React functional component that provides an input field for updating a user's email address.
 *
 * @remarks
 * This component is designed for use in forms where a user can update their email address.
 *
 * @param props - The component's props.
 * @param props.value - The current value of the email input field.
 * @param props.label - The label for the email input field.
 * @param props.onChange - A function to handle changes to the email input field.
 *
 * @example
 * ```tsx
 * <UpdateEmailField value={emailValue} label="New Email" onChange={handleEmailChange} />
 * ```
 *
 * @see {@link https://react-icons.github.io/react-icons/ | react-icons} for including icons.
 *
 */
interface EmailInputProps {
  value: string;
  label: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UpdateEmailField: React.FC<EmailInputProps> = ({ value, label, onChange }) => {
  return (
    <InputField label={label} icon={<AiOutlineMail />}>
      <input type="email" value={value} onChange={onChange} required />
    </InputField>
  );
};

export default UpdateEmailField;
