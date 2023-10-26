import React from 'react';
import styles from './playback.module.scss';
import usePlaybackManager from '@/app/hooks/usePlaybackManager';
import PlaybackButton from './PlaybackButton';
import { useErrorModalContext } from '../../contexts/ErrorModalContext';
import { useProjectContext } from '@/app/contexts/ProjectContext';

interface PlaybackProps {
  // audioUrl: string;
  baseUrl: string;
}

const Playback: React.FC<PlaybackProps> = ({ baseUrl }) => {
  const { startPlayback, pausePlayback, playbackState } = usePlaybackManager();
  const { setIsError, setErrorMessage } = useErrorModalContext();
  const { selectedNote } = useProjectContext();

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
