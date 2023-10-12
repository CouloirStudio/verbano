import React, { ChangeEvent } from 'react';
import InputField from './InputField';
import { AiOutlineLock } from 'react-icons/ai';

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  return (
    <InputField label="Password" icon={<AiOutlineLock />}>
      <input
        id={'password'}
        type="password"
        value={value}
        onChange={onChange}
        required={true}
      />
    </InputField>
  );
};

export default PasswordInput;
