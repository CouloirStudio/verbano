import styles from './transcription.module.scss';
import { useProjectContext } from '../../contexts/ProjectContext';
import { GET_TRANSCRIPTION } from '../../graphql/queries/getNotes';
import Box from '@mui/material/Box';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useNoteContext } from '@/app/contexts/NoteContext';
import Display from '@/app/components/Display';

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
  const { transcription, setTranscription } = useNoteContext();

  // Use GraphQL to get the transcription
  const [getTranscript, { data }] = useLazyQuery(GET_TRANSCRIPTION);

  // Perform these actions when the component is rendered
  useEffect(() => {
    // Check for existing transcription
    if (Id) {
      getTranscript({ variables: { id: Id } });
    }
    if (data && data.getTranscription) {
      try {
        const transcriptionData = JSON.parse(data.getTranscription);
        setTranscription(transcriptionData.text); // Update the transcription in the context
      } catch (error) {
        setIsError(true);
        if (typeof error === 'object' && error !== null && 'message' in error) {
          setErrorMessage(`${(error as Error).message}`);
        } else {
          setErrorMessage(`An unknown error occurred.`);
        }
      }
    }
  }, [data, setTranscription, setIsError, setErrorMessage, Id, getTranscript]);

  return (
    <Box className={styles.transcription}>
      <Display content={transcription} title={selectedNote?.noteName} />
    </Box>
  );
};

export default TranscriptionDisplay;
