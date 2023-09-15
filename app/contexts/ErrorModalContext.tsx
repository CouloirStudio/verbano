import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of your error context
interface ErrorContextType {
  errorMessage: string | null;
  isError: boolean;
  setIsError: (error: boolean) => void;
  setError: (errorMessage: string | null) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorContext = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error(
      'useErrorContext must be used within an ErrorContextProvider',
    );
  }
  return context;
};

interface ErrorContextProviderProps {
  children: ReactNode;
}

export const ErrorContextProvider: React.FC<ErrorContextProviderProps> = ({
  children,
}) => {
  const [errorMessage, setError] = useState<string | null>('Ruh Roh Shaggy!');
  const [isError, setIsError] = useState<boolean>(true);
  return (
    <ErrorContext.Provider
      value={{ errorMessage, setError, isError, setIsError }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
