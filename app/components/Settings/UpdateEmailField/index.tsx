import React, {ChangeEvent} from 'react';
import InputField from '@/app/components/Login/InputField';
import {AiOutlineMail} from 'react-icons/ai';

interface EmailInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UpdateEmailField: React.FC<EmailInputProps> = ({value, onChange}) => {
  return (
    <InputField label="Update Email" icon={<AiOutlineMail/>}>
      <input
        type="email"
        id={'email'}
        value={value}
        onChange={onChange}
        required/>
    </InputField>
  );
};

export default UpdateEmailField;
