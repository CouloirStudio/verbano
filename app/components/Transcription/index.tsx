import React from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import { transcribe } from '@/app/api/transcription';

function TranscriptionButton() {
  const BASE_URL = 'http://localhost:3000';

  const context = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const selectedNote = context.selectedNote;
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
          const updatedNote = { ...selectedNote, transcription };
          context.setSelectedNote(updatedNote);
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

  // DUMMY METHOD FOR EVENTUAL TRANSCRIPTION SERVICE

  return <button onClick={transcribeAudio}>Transcribe</button>;
}

export default TranscriptionButton;
