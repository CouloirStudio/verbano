import { ChangeEvent, KeyboardEvent, useState } from 'react';

type UseDoubleClickEditReturn = {
  isEditing: boolean;
  value: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    submitFunction: (value: string) => Promise<void>,
  ) => Promise<void>;
  exitEditing: () => void;
  handleDoubleClick: () => void;
  handleBlur: () => void;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLDivElement>,
    submitFunction: (value: string) => Promise<void>,
  ) => Promise<void>;
};

const useDoubleClickEdit = (initialValue: string): UseDoubleClickEditReturn => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setValue(initialValue);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (
    submitFunction: (value: string) => Promise<void>,
  ) => {
    setIsEditing(false);
    await submitFunction(value);
  };

  const exitEditing = () => {
    setIsEditing(false);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = async (
    event: KeyboardEvent<HTMLDivElement | HTMLInputElement>,
    submitFunction: (value: string) => Promise<void>,
  ) => {
    if (event.key === 'Enter') {
      await handleSubmit(submitFunction);
    }
  };

  return {
    isEditing,
    value,
    handleChange,
    handleSubmit,
    handleDoubleClick,
    handleBlur,
    handleKeyDown,
    exitEditing,
  };
};

export default useDoubleClickEdit;
