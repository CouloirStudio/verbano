import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

type UseDoubleClickEditReturn<T> = {
  isEditing: boolean;
  value: T;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (submitFunction: (value: T) => Promise<void>) => Promise<void>;
  exitEditing: () => void;
  handleDoubleClick: () => void;
  handleBlur: () => void;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLDivElement>,
    submitFunction: (value: T) => Promise<void>,
  ) => Promise<void>;
};

/**
 * Custom hook to handle double click editing
 * @param initialValue - initial value of the input (text)
 */
const useDoubleClickEdit = <T>(
  initialValue: T,
): UseDoubleClickEditReturn<T> => {
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
    setValue(event.target.value as unknown as T);
  };

  /**
   * Handle submit of the input
   * @param submitFunction - function to submit the value
   */
  const handleSubmit = async (submitFunction: (value: T) => Promise<void>) => {
    try {
      await submitFunction(value);
      setIsEditing(false);
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  /**
   * Exit editing mode
   */
  const exitEditing = () => {
    setIsEditing(false);
    setValue(initialValue);
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
    submitFunction: (value: T) => Promise<void>,
  ) => {
    if (event.key === 'Enter') {
      await handleSubmit(submitFunction);
    } else if (event.key === 'Escape') {
      exitEditing();
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
