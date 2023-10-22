import React from 'react';
import { useProjectContext } from '@/app/contexts/ProjectContext';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import { transcribe } from '@/app/api/transcription';

function TranscriptionButton() {
  const BASE_URL = 'http://localhost:3000';

  const context = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const selectedNote = context.selectedNote;
  // const { setSelectedNote } = useProjectContext();
  const transcribeAudio = () => {
    try {
      if (selectedNote) {
        transcribe(selectedNote?.audioLocation, BASE_URL).then((note) => {
          console.log(note);
        });
      } else {
        setIsError(true);
        setErrorMessage('No note selected.');
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setErrorMessage(error.getMessage());
    }
  };

  // DUMMY METHOD FOR EVENTUAL TRANSCRIPTION SERVICE

  return <button onClick={transcribeAudio}>Transcribe</button>;
}

export default TranscriptionButton;
