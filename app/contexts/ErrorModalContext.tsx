import React, { createContext, ReactNode, useContext, useState } from 'react';

/**
 * Defines the shape of the ErrorModalContext
 */
interface ErrorModalContextType {
  errorMessage: string | null;
  isError: boolean;
  setIsError: (error: boolean) => void;
  setErrorMessage: (errorMessage: string | null) => void;
}

/**
 * Context for the error modal
 */
const ErrorModalContext = createContext<ErrorModalContextType | undefined>(
  undefined,
);
/**
 * A custom hook ot access the ErrorModalContext and ensure it is used
 * from within the provider.
 *
 * @throws Will throw an error if used outside of ErrorContextProvider.
 * @returns {ErrorModalContextType} the error modal context
 */
export const useErrorModalContext = (): ErrorModalContextType => {
  const context = useContext(ErrorModalContext);
  if (!context) {
    throw new Error(
      'useErrorContext must be used within an ErrorContextProvider',
    );
  }
  return context;
};

/**
 * Props for the ErrorContextProvider
 */
interface ErrorContextProviderProps {
  children: ReactNode;
}

/**
 * Component for providing ErrorModalContext.
 * @param children ErrorContextProviderProps
 */
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
