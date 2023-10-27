import React, { useEffect, useState } from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import Box from '@mui/material/Box';
import styles from './note.module.scss';
import { RecorderProvider } from '@/app/contexts/RecorderContext';
import Recorder from '@/app/components/Recorder';
import { Playback } from '@/app/components/Playback';
import { TranscriptionButton } from '@/app/components/Transcription';
import { useNoteContext } from '@/app/contexts/NoteContext';
import { useTheme } from '@mui/material/styles';

const NoteDetails = () => {
  const { selectedNote } = useProjectContext();
  const { transcription, setTranscription, refreshNoteDetails } =
    useNoteContext();
  const [hasRecording, setHasRecording] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setHasRecording(!!(selectedNote && selectedNote.audioLocation));
  }, [selectedNote, refreshNoteDetails]);

  return (
    <Box
      className={styles.noteDetailsContainer}
      sx={{
        color: theme.custom?.text,
        backgroundColor: theme.custom?.mainBackground,
      }}
    >
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
