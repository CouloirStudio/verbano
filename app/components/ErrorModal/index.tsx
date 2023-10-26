import React, { useEffect } from 'react';
import styles from './errormodal.module.scss';
import { useErrorModalContext } from '../../contexts/ErrorModalContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AiFillQuestionCircle } from 'react-icons/ai';
import DefaultModal from '../DefaultModal';

const ErrorModal = () => {
  const { isError, errorMessage, setIsError } = useErrorModalContext();

  // Set to false on unmount.
  useEffect(() => {
    return () => {
      setIsError(false);
    };
  }, [setIsError]);

  const dismissModal = () => {
    setIsError(false);
  };

  const modalBody = (
    <Box className={styles.ErrorModal}>
      <AiFillQuestionCircle className={styles.icon} />
      <Typography id="errorTitle" variant="h6" className={styles.title}>
        WOOPS!
      </Typography>
      <Typography id="errorMessage" className={styles['modal-error']}>
        {errorMessage}
      </Typography>
      <Button variant="text" onClick={dismissModal}>
        Dismiss
      </Button>
    </Box>
  );

  return (
    <DefaultModal
      isOpen={isError}
      onClose={dismissModal}
      title="Woopsies!"
      className={`${styles.ErrorModal}`} // You can append or override the default class here
    >
      {modalBody}
    </DefaultModal>
  );
};

export default ErrorModal;
