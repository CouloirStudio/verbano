import React, { ChangeEvent, useState } from 'react';
import InputField from '@/app/components/Login/InputField';
import { AiOutlineLock } from 'react-icons/ai';

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  text: string;
}

const UpdatePasswordField: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  text,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Basic password validation example
    if (e.target.value.length < 8) {
      setError('Password should be at least 8 characters long.');
    } else {
      setError(null);
    }

    onChange(e);
  };

  return (
    <div>
      <InputField label={text} icon={<AiOutlineLock />}>
        <input
          type="password"
          value={value}
          onChange={handleInputChange}
        />
      </InputField>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UpdatePasswordField;
