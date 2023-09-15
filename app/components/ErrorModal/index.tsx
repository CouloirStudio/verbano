import React, { useEffect } from 'react';
import './errormodal.module.scss';
import {
  ErrorContextProvider,
  useErrorContext,
} from '@/app/contexts/ErrorModalContext';

const ErrorModal = () => {
  const { isError, errorMessage, setIsError } = useErrorContext();

  // Use useEffect to open the modal when an error occurs
  useEffect(() => {
    if (isError) {
      setIsError(true);
    }
  }, []); // Empty dependency array ensures this effect runs once on mount

  const closeModal = () => {
    setIsError(false);
  };

  return (
    <div className="ErrorModal">
      {isError && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={closeModal} className="modal-close-button">
              X
            </button>
            <h1>Test</h1>
            {/* Display the error message from ErrorContext */}
            {isError && <p className="modal-error">{errorMessage}</p>}
            {/* Add modal content here */}
          </div>
        </div>
      )}
    </div>
  );
};

const WrappedErrorModal: React.FC = () => (
  <ErrorContextProvider>
    <ErrorModal />
  </ErrorContextProvider>
);

export default WrappedErrorModal;
