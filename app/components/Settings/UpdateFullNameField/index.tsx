import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/Login/InputField';
import { AiOutlineUser } from 'react-icons/ai';

interface FullNameInputProps {
  firstName: string;
  lastName: string;
  firstLabel: string;
  secondLabel: string;
  onFirstNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UpdateFullName: React.FC<FullNameInputProps> = ({
  firstName,
  lastName,
  firstLabel,
  secondLabel,
  onFirstNameChange,
  onLastNameChange,



}) => {
  return (
    <>
      <InputField label={firstLabel} icon={<AiOutlineUser />}>
        <input
          type="text"
          value={firstName}
          onChange={onFirstNameChange}
          required
        />
      </InputField>
      <InputField label={secondLabel} icon={<AiOutlineUser />}>
        <input
          type="text"
          value={lastName}
          onChange={onLastNameChange}
          required
        />
      </InputField>
    </>
  );
};

export default UpdateFullName;
