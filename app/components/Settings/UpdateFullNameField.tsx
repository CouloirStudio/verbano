import React, {ChangeEvent} from 'react';
import InputField from '@/app/components/Login/InputField';
import {AiOutlineUser} from "react-icons/ai";

interface FullNameInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UpdateFullName: React.FC<FullNameInputProps> = ({value, onChange}) => {
    return (
        <InputField label="Update Name" icon={<AiOutlineUser/>}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                required={true}
            />
        </InputField>
    )
}

export default UpdateFullName;