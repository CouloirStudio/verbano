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

/**
 * Custom hook to handle double click editing
 * @param initialValue - initial value of the input (text)
 */
const useDoubleClickEdit = (initialValue: string): UseDoubleClickEditReturn => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  /**
   * Handle double click on the text
   */
  const handleDoubleClick = () => {
    setIsEditing(true);
    setValue(initialValue);
  };

  /**
   * Handle change of the input
   * @param event - change event
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  /**
   * Handle submit of the input
   * @param submitFunction - function to submit the value
   */
  const handleSubmit = async (
    submitFunction: (value: string) => Promise<void>,
  ) => {
    setIsEditing(false);
    await submitFunction(value);
  };

  /**
   * Exit editing mode
   */
  const exitEditing = () => {
    setIsEditing(false);
  };

  /**
   * Handle blur of the input (when it loses focus)
   */
  const handleBlur = () => {
    setIsEditing(false);
  };

  /**
   * Handle key down of the input
   * @param event - key down event
   * @param submitFunction - function to submit the value
   */
  const handleKeyDown = async (
    event: KeyboardEvent<HTMLDivElement | HTMLInputElement>,
    submitFunction: (value: string) => Promise<void>,
  ) => {
    if (event.key === 'Enter') {
      await handleSubmit(submitFunction);
    }
  };

  /**
   * Return the values and functions
   */
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
