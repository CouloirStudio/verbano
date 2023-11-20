import React, { useEffect, useState } from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import Box from '@mui/material/Box';
import styles from './audio.module.scss';
import Recorder from '@/app/components/Audio/Recorder';
import { Playback } from '@/app/components/Audio/Playback';
import { TranscriptionButton } from '@/app/components/Audio/Transcription';
import { useNoteContext } from '@/app/contexts/NoteContext';
import { useTheme } from '@mui/material/styles';
import SummarizeButton from '@/app/components/Audio/Summary/SummarizeButton';

/**
 * A component that houses the three main audio components.
 * @constructor
 */
const AudioHeader = () => {
  const { selectedNote, selectedProject } = useProjectContext();
  const { refreshNoteDetails } = useNoteContext();
  const [hasRecording, setHasRecording] = useState(false);
  const theme = useTheme();

  // Component updates when selected note is changed.
  useEffect(() => {
    setHasRecording(!!(selectedNote && selectedNote.audioLocation));
  }, [selectedNote]);

  return (
    <Box
      className={styles.AudioContainer}
      sx={{
        color: theme.custom?.text,
        backgroundColor: theme.custom?.mainBackground,
      }}
    >
      {!hasRecording ? (
        <Recorder
          refreshNoteDetails={refreshNoteDetails}
          selectedNote={selectedNote}
          selectedProject={selectedProject}
        />
      ) : (
        <Playback baseUrl="https://localhost:3000" selectedNote={selectedNote} />
      )}
      <TranscriptionButton />
      <SummarizeButton />
    </Box>
  );
};

export default AudioHeader;
