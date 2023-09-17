import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of your error context
interface ErrorModalContextType {
  errorMessage: string | null;
  isError: boolean;
  setIsError: (error: boolean) => void;
  setErrorMessage: (errorMessage: string | null) => void;
}

const ErrorModalContext = createContext<ErrorModalContextType | undefined>(
  undefined,
);

export const useErrorModalContext = (): ErrorModalContextType => {
  const context = useContext(ErrorModalContext);
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

export const ErrorModalContextProvider: React.FC<ErrorContextProviderProps> = ({
  children,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  // setting isError to true is what causes the Modal to appear.
  const [isError, setIsError] = useState<boolean>(false);
  return (
    <ErrorModalContext.Provider
      value={{ errorMessage, setErrorMessage, isError, setIsError }}
    >
      {children}
    </ErrorModalContext.Provider>
  );
};
