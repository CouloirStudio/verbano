import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import ErrorModal from '@/app/components/ErrorModal';
import '@testing-library/jest-dom';
import {
  ErrorModalContextProvider,
  useErrorModalContext,
} from '@/app/contexts/ErrorModalContext';

describe('ErrorModal Component', () => {
  beforeEach(() => {});

  const TestingComponent = () => {
    const { setIsError, setErrorMessage } = useErrorModalContext();
    useEffect(() => {
      setIsError(true);
      setErrorMessage('banana');
    });
    return <div></div>;
  };

  it('Does not render when isError is false', () => {
    render(
      <ErrorModalContextProvider>
        <ErrorModal />
      </ErrorModalContextProvider>,
    );
    expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
  });

  it('renders the modal when isError is true', () => {
    render(
      <ErrorModalContextProvider>
        <ErrorModal />
        <TestingComponent />
      </ErrorModalContextProvider>,
    );
    expect(screen.getByText('banana')).toBeInTheDocument();
  });
});
