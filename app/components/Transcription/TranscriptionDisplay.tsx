import styles from './transcription.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import { GET_TRANSCRIPTION } from '../../graphql/queries/getNotes';
import Box from '@mui/material/Box';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import React, { useEffect } from 'react';
import Display from '@/app/components/Display';
import { useLazyQuery } from '@apollo/client';

interface TranscriptionDisplayProps {
  Id?: string;
}

/**
 * A functional component to display a transcription.
 * @param Id
 * @constructor
 */
const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ Id }) => {
  const context = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const selectedNote = context.selectedNote;

  // Use GraphQL to get the transcription
  const [getTranscript, { data, error }] = useLazyQuery(GET_TRANSCRIPTION);

  useEffect(() => {
    if (Id) {
      getTranscript({ variables: { id: Id } });
    }
  }, [Id]);

  if (error) {
    console.log(error);
  }

  const getTranscription = (): string => {
    if (!Id) {
      return 'No transcription.';
    }

    try {
      if (data && data.getTranscription) {
        // Parse json so that we can get the text
        const transcription = JSON.parse(data.getTranscription);
        return transcription.text;
      }
    } catch (error) {
      setIsError(true);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setErrorMessage(`${(error as Error).message}`);
      } else {
        setErrorMessage(`An unknown error occurred.`);
      }
      return 'Error retrieving transcription. ';
    }
    return 'No Transcription.';
  };

  return (
    <Box className={styles.transcription}>
      <Display content={getTranscription()} title={selectedNote?.noteName} />
    </Box>
  );
};

export default TranscriptionDisplay;
