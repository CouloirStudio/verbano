import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import ErrorModal from '@/app/components/Modals/ErrorModal';
import { expect } from '@jest/globals';
import {
  ErrorModalContextProvider,
  useErrorModalContext,
} from '@/app/contexts/ErrorModalContext';

// This is a simple set of tests for the ErrorModal component and the accompanying ErrorModalContext.
describe('ErrorModal Component', () => {
  beforeEach(() => {});

  // Testing Component to update the ErrorModalContext using hooks from within the provider.
  // Values are hardcoded as there is only one other alternative to the default values.
  const TestingComponent = () => {
    const { setIsError, setErrorMessage } = useErrorModalContext();
    useEffect(() => {
      setIsError(true);
      setErrorMessage('banana');
    });
    return <div></div>;
  };

  // Simply renders the component in it's default state and checks that it did not render.
  it('Does not render when isError is false', () => {
    render(
      <ErrorModalContextProvider>
        <ErrorModal />
      </ErrorModalContextProvider>,
    );
    expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
  });

  // Renders the component with the testing component, which updates the values and triggers the render.
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
