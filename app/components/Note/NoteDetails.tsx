import React, { useEffect, useState } from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import Box from '@mui/material/Box';
import styles from './note.module.scss';
import { RecorderProvider } from '@/app/contexts/RecorderContext';
import Recorder from '@/app/components/Recorder';
import { Playback } from '@/app/components/Playback';
import { TranscriptionButton } from '@/app/components/Transcription';
import { useNoteContext } from '@/app/contexts/NoteContext';

const NoteDetails = () => {
  const { selectedNote } = useProjectContext();
  const {
    transcription,
    setTranscription,
    refreshNoteDetails: refreshNoteDetails,
  } = useNoteContext();
  const [hasRecording, setHasRecording] = useState(false);

  useEffect(() => {
    if (selectedNote && selectedNote.audioLocation) {
      setHasRecording(true);
    } else {
      setHasRecording(false);
    }
  }, [selectedNote, refreshNoteDetails]);

  return (
    <Box className={styles.noteDetailsContainer}>
      {!hasRecording ? (
        <RecorderProvider>
          <Recorder refreshNoteDetails={refreshNoteDetails} />
        </RecorderProvider>
      ) : (
        <Playback baseUrl="http://localhost:3000" />
      )}
      <TranscriptionButton />
    </Box>
  );
};

export default NoteDetails;
