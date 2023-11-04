import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './transcription.module.scss';
import {useProjectContext} from '@/app/contexts/ProjectContext';
import {useErrorModalContext} from '@/app/contexts/ErrorModalContext';
import {useNoteContext} from '@/app/contexts/NoteContext';
import ScrollView from '@/app/components/UI/ScrollView';
import Footer from '@/app/components/Layout/Footer';
import {useLazyQuery} from '@apollo/client';
import GetTranscription from '@/app/graphql/queries/GetTranscription.graphql';
import TranscriptionSegment from './TranscriptionSegment';

// Assuming the transcription is a JSON string of an array of objects with start and text properties
interface TranscriptionSegmentData {
  start: number;
  text: string;
}

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
        setErrorMessage(
          error instanceof Error ? error.message : 'An unknown error occurred.',
        );
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

  useEffect(() => {
    console.log('transcription', transcription);
  }, [transcription]);

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
