import React from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import { transcribe } from '@/app/api/transcription';
import IconButton from '@mui/material/IconButton';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { useNoteContext } from '@/app/contexts/NoteContext';

function TranscriptionButton() {
  const BASE_URL = 'http://localhost:3000';
  const context = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const selectedNote = context.selectedNote;

  const { setTranscription } = useNoteContext();
  const transcribeAudio = () => {
    try {
      if (selectedNote) {
        transcribe(
          selectedNote?.audioLocation,
          BASE_URL,
          selectedNote?.id,
        ).then((transcription) => {
          if (!transcription) {
            return;
          }
          // this works
          setTranscription(transcription.text);
        });
      } else {
        setIsError(true);
        setErrorMessage('No note selected.');
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  return (
    <IconButton disabled={selectedNote === undefined} onClick={transcribeAudio}>
      <DriveFileRenameOutlineOutlinedIcon />
    </IconButton>
  );
}

export default TranscriptionButton;
