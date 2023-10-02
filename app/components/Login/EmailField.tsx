import React, { ChangeEvent } from 'react';
import InputField from './InputField';
import { AiOutlineUser } from 'react-icons/ai';

interface EmailInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange }) => {
  return (
    <InputField label="Email" icon={<AiOutlineUser />}>
      <input type="text" value={value} onChange={onChange} required={true} />
    </InputField>
  );
};

export default EmailInput;
