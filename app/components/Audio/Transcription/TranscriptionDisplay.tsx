import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './transcription.module.scss';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import { useNoteContext } from '@/app/contexts/NoteContext';
import ScrollView from '@/app/components/UI/ScrollView';
import Footer from '@/app/components/Layout/Footer';
import { useLazyQuery } from '@apollo/client';
import GetTranscription from '@/app/graphql/queries/GetTranscription.graphql';
import TranscriptionSegment from './TranscriptionSegment';

class TranscriptionParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranscriptionParseError';
  }
}

interface TranscriptionSegmentData {
  start: number;
  text: string;
}

/**
 * `TranscriptionDisplay` is a component that renders the transcription of a selected note.
 * It fetches the transcription data via a GraphQL query and displays it segment by segment.
 */
const TranscriptionDisplay: React.FC = () => {
  const { selectedNote } = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const { transcription, setTranscription } = useNoteContext();
  const [getTranscript, { data, loading, error }] = useLazyQuery<{
    getTranscription: string;
  }>(GetTranscription);

  useEffect(() => {
    if (!selectedNote?.id) return;

    getTranscript({ variables: { id: selectedNote.id } });

    if (data && data.getTranscription) {
      try {
        const transcriptionData: TranscriptionSegmentData[] = JSON.parse(
          data.getTranscription,
        );
        setTranscription(JSON.stringify(transcriptionData, null, 2));
      } catch (error: unknown) {
        setIsError(true);
        let errorMessage = 'An unknown error occurred.';
        if (error instanceof TranscriptionParseError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = 'An unexpected error occurred: ' + error.message;
        }
        setErrorMessage(errorMessage);
      }
    } else {
      setTranscription('');
    }
  }, [
    selectedNote?.id,
    getTranscript,
    loading,
    error,
    data,
    setIsError,
    setErrorMessage,
    setTranscription,
  ]);

  useEffect(() => {}, [transcription]);

  // Parse and render transcription segments
  const renderTranscription = (transcriptionJson: string) => {
    try {
      const segments: TranscriptionSegmentData[] =
        JSON.parse(transcriptionJson);
      return segments.map((segment, index) => (
        <TranscriptionSegment key={index} segment={segment} />
      ));
    } catch (e) {
      return (
        <Typography variant="body2">
          Failed to load Replicate format. Try retranscribing. Current data:{' '}
          {transcriptionJson}
        </Typography>
      );
    }
  };

  return (
    <Box className={styles.transcription}>
      <ScrollView className={styles.scrollView}>
        {transcription ? renderTranscription(transcription) : null}
      </ScrollView>
      <Footer
        footerText={
          transcription ? ` ${transcription}` : 'No transcription available'
        }
      />
    </Box>
  );
};

export default TranscriptionDisplay;
