import React, { useEffect } from 'react';
import styles from './playback.module.scss';
import usePlaybackManager, {
  PlaybackState,
} from '@/app/hooks/usePlaybackManager';
import PlaybackButton from './PlaybackButton';
import { useErrorModalContext } from '@/app/contexts/ErrorModalContext';
import { NoteType } from '@/app/graphql/resolvers/types';

interface PlaybackProps {
  baseUrl: string;
  selectedNote: NoteType | null;
}

/**
 * The Playback component provides an interface for audio playback.
 * It includes controls for starting, pausing, and displaying the current state of playback.
 *
 * @param {PlaybackProps} props - The props for the Playback component.
 * @param {string} props.baseUrl - The base URL for the audio file.
 * @param {NoteType | null} props.selectedNote - The selected note containing the audio file.
 */
const Playback: React.FC<PlaybackProps> = ({
  baseUrl,
  selectedNote,
}: PlaybackProps) => {
  const {
    startPlayback,
    pausePlayback,
    playbackState,
    setPlaybackState,
    currentAudioSourceRef,
    updateStateFromPlayer,
  } = usePlaybackManager();
  const { setIsError, setErrorMessage } = useErrorModalContext();

  useEffect(() => {
    // On render, if the selected note has changed, the component state will be idle.
    if (selectedNote?.audioLocation != currentAudioSourceRef.current) {
      setPlaybackState(PlaybackState.IDLE);
    } else {
      // Make the component state match the current audio player.
      updateStateFromPlayer();
    }
  }, [
    currentAudioSourceRef,
    selectedNote,
    setPlaybackState,
    updateStateFromPlayer,
  ]);

  /**
   * Toggles the playback state using the Playback hook.
   */
  const togglePlayback = async () => {
    try {
      switch (playbackState) {
        case 'idle':
        case 'paused':
          await startPlayback(baseUrl, selectedNote?.audioLocation || '');
          break;
        case 'playing':
          await pausePlayback();
          break;
        default:
          console.error(`Unexpected playback state: ${playbackState}`);
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        setIsError(true);
        setErrorMessage(error.message || 'An error occurred during playback.');
      } else {
        setIsError(true);
        setErrorMessage('An unexpected error occurred during playback.');
      }
    }
  };

  return (
    <div className={styles.playback}>
      {playbackState === 'processing' ? (
        <span>Processing...</span>
      ) : (
        <PlaybackButton
          playbackState={playbackState}
          togglePlayback={togglePlayback}
        />
      )}
    </div>
  );
};

export default Playback;
