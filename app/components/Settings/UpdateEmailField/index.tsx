import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Login/InputField';
import { AiOutlineMail } from 'react-icons/ai';

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
