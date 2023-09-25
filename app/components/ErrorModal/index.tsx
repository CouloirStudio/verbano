import React, { useEffect } from 'react';
import styles from './errormodal.module.scss';
import { useErrorModalContext } from '../../contexts/ErrorModalContext';

const ErrorModal = () => {
  const { isError, errorMessage, setIsError } = useErrorModalContext();

  // Set to false on unmount.
  useEffect(() => {
    return () => {
      setIsError(false);
    };
  }, [setIsError]);

  // dismiss the modal by setting isError to false.
  const dismissModal = () => {
    setIsError(false);
  };

  return (
    <div>
      {/* Conditionally render the overlay and modal, if isError is set to true, it will appear. */}
      {isError && (
        <div className={styles.ErrorModalOverlay}>
          <div className={styles.ErrorModal}>
            <span className={styles.title}>Woopsies!</span>
            <p className={styles['modal-error']}>{errorMessage}</p>
            <button className={styles.button} onClick={dismissModal}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorModal;
