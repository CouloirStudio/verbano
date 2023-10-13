import React, {ChangeEvent} from 'react';
import InputField from '@/app/components/Login/InputField';
import {AiOutlineUser} from 'react-icons/ai';

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
    <>
      <InputField label="Update First Name" icon={<AiOutlineUser/>}>
        <input
          type="text"
          id={'firstName'}
          value={firstName}
          onChange={onFirstNameChange}
          required
        />
      </InputField>
      <InputField label="Update Last Name" icon={<AiOutlineUser/>}>
        <input
          type="text"
          id={'lastName'}
          value={lastName}
          onChange={onLastNameChange}
          required
        />
      </InputField>
    </>
  );
};

export default UpdateFullName;
