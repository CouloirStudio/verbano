import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Login/InputField';
import { AiOutlineMail } from 'react-icons/ai';

interface EmailInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UpdateEmailField: React.FC<EmailInputProps> = ({ value, onChange }) => {
  return (
    <InputField label="Update Email" icon={<AiOutlineMail />}>
      <input type="text" value={value} onChange={onChange} required={true} />
    </InputField>
  );
};

export default UpdateEmailField;
