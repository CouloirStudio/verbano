import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Login/InputField';
import { AiOutlineUser } from 'react-icons/ai';

interface FullNameInputProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UpdateFullName: React.FC<FullNameInputProps> = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}) => {
  return (
    <div>
      <InputField label="First Name" icon={<AiOutlineUser />}>
        <input
          type="text"
          value={firstName}
          onChange={onFirstNameChange}
          required
        />
      </InputField>
      <InputField label="Last Name" icon={<AiOutlineUser />}>
        <input
          type="text"
          value={lastName}
          onChange={onLastNameChange}
          required
        />
      </InputField>
    </div>
  );
};

export default UpdateFullName;
