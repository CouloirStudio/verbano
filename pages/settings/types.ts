import React from 'react';

export type ReactFormEvent<T> = React.FormEvent<T>;
export type setErrorMessageType = (message: string) => void;
export type setIsErrorType = (isError: boolean) => void;
export type setFirstNameType = (firstName: string) => void;
export type setLastNameType = (lastName: string) => void;
export type setEmailType = (email: string) => void;
export type setSuccessMessageType = (message: string | null) => void;
export type setIsSuccessType = (isSuccess: boolean) => void;
export type refetchType = () => Promise<any>; // Replace 'any' with the actual type of your refetch result
