import React, {ChangeEvent} from 'react';
import InputField from '@/app/components/Login/InputField';
import {AiOutlineLock} from "react-icons/ai";

interface PasswordInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    text: string;
}

const UpdatePasswordField: React.FC<PasswordInputProps> = ({value, onChange, text}) => {
    return (
        <InputField
            label={text}
            icon={<AiOutlineLock/>}
        >
            <input
                type="password"
                value={value}
                onChange={onChange}
                required={true}
            />
        </InputField>
    );
};

export default UpdatePasswordField;
