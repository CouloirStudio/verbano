import React, {useEffect, useRef} from 'react';
import {useProjectContext} from '@/app/contexts/ProjectContext';
import {useErrorModalContext} from '@/app/contexts/ErrorModalContext';
import {transcribe} from '@/app/api/transcription';
import IconButton from '@mui/material/IconButton';
import {useNoteContext} from '@/app/contexts/NoteContext';
import {Tooltip, useTheme} from '@mui/material';
import client from '@/app/config/apolloClient';
import GetTranscription from '@/app/graphql/queries/GetTranscription.graphql';
import {useProgress} from '@/app/contexts/ProgressContext';

/**
 * A button that grabs the selected note and transcribes the audio. .
 * @constructor
 */
const TranscriptionButton = () => {
  const BASE_URL = 'https://localhost:3000';
  const { selectedNote, refetchData } = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const { setTranscription } = useNoteContext();

  const selectedNoteRef = useRef(selectedNote);

  const { updateProgress } = useProgress();

  const theme = useTheme();

  useEffect(() => {
    selectedNoteRef.current = selectedNote;
  }, [selectedNote]);

  /**
   * Transcribes audio with Whisper and sets transcription state to the new transcription.
   */
  const transcribeAudio = () => {
    if (!selectedNote) {
      setIsError(true);
      setErrorMessage('No note selected.');
      return;
    }

    updateProgress(selectedNote.noteName, selectedNote.id, 'Transcription', 0);

    transcribe(selectedNote.audioLocation, BASE_URL, selectedNote.id)
      .then((transcription) => {
        if (!transcription) {
          clearInterval(progressInterval);
          return;
        }

        const currentNoteId = selectedNoteRef.current
          ? selectedNoteRef.current.id
          : null;
        if (selectedNote.id !== currentNoteId) {
          clearInterval(progressInterval);
          return;
        }

        updateProgress(
          selectedNote.noteName,
          selectedNote.id,
          'Transcription',
          1,
          0,
        );

        setTranscription(transcription);
        client.refetchQueries({
          include: [
            {
              query: GetTranscription,
              variables: { id: selectedNote.id },
            },
          ],
        });

        refetchData();
      })
      .catch((err) => {
        clearInterval(progressInterval);
        setErrorMessage(err.message);
        setIsError(true);
      });

    // Polling for progress
    const checkProgress = () => {
      fetch(`${BASE_URL}/transcription/progress/${selectedNote.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.progress === 1) {
            clearInterval(progressInterval);
          }

          updateProgress(
            selectedNote.noteName,
            selectedNote.id,
            'Transcription',
            data.progress,
            data.estimatedSecondsLeft,
          );
        })
        .catch((error) => {
          console.error('Error fetching transcription progress:', error);
        });
    };

    const progressInterval = setInterval(checkProgress, 1000);
  };

  const disabled = !selectedNote?.audioLocation;
  const disabledColour = disabled
    ? theme.palette.text.disabled
    : theme.palette.primary.main;
  const tooltipText = disabled ? 'Record audio to transcribe' : 'Transcribe';

  return (
    <Tooltip title={tooltipText}>
      <span>
        <IconButton
          sx={{
            //temporary styling for presentation
            width: '50px',
            height: '50px',
          }}
          disabled={!selectedNote?.audioLocation}
          onClick={transcribeAudio}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M28.4375 12.1163C29.445 13.2588 30 14.7263 30 16.2501V22.5001C30 25.9463 27.1963 28.7501 23.75 28.7501H6.25C2.80375 28.7501 0 25.9463 0 22.5001V16.2501C0 12.8038 2.80375 10.0001 6.25 10.0001H11.25C11.9412 10.0001 12.5 10.5601 12.5 11.2501C12.5 11.9401 11.9412 12.5001 11.25 12.5001H6.25C4.1825 12.5001 2.5 14.1826 2.5 16.2501V22.5001C2.5 24.5676 4.1825 26.2501 6.25 26.2501H23.75C25.8175 26.2501 27.5 24.5676 27.5 22.5001V16.2501C27.5 15.3363 27.1663 14.4551 26.5625 13.7701C26.1063 13.2526 26.155 12.4626 26.6738 12.0051C27.19 11.5501 27.98 11.5988 28.4375 12.1163ZM6.25 19.3751C6.25 20.4101 7.09 21.2501 8.125 21.2501C9.16 21.2501 10 20.4101 10 19.3751C10 18.3401 9.16 17.5001 8.125 17.5001C7.09 17.5001 6.25 18.3401 6.25 19.3751ZM14.375 21.2501C15.41 21.2501 16.25 20.4101 16.25 19.3751C16.25 18.3401 15.41 17.5001 14.375 17.5001C13.34 17.5001 12.5 18.3401 12.5 19.3751C12.5 20.4101 13.34 21.2501 14.375 21.2501ZM15 13.7501V11.7676C15 10.4326 15.52 9.17633 16.465 8.23258L23.5987 1.09883C25.0612 -0.363672 27.4388 -0.363672 28.9013 1.09883C29.6087 1.80633 30 2.74883 30 3.75008C30 4.75133 29.6087 5.69383 28.9013 6.40258L21.7675 13.5363C20.8237 14.4801 19.5675 15.0013 18.2325 15.0013H16.25C15.5588 15.0013 15 14.4413 15 13.7513V13.7501ZM17.5 12.5001H18.2325C18.9 12.5001 19.5275 12.2401 20 11.7676L27.1338 4.63383C27.37 4.39758 27.5 4.08383 27.5 3.75008C27.5 3.41633 27.37 3.10258 27.1338 2.86633C26.645 2.37758 25.855 2.37883 25.3662 2.86633L18.2325 10.0001C17.7675 10.4663 17.5 11.1101 17.5 11.7676V12.5001Z"
              fill={disabledColour}
            />
          </svg>
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default TranscriptionButton;
