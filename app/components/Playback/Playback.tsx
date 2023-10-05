import React from 'react';
import styles from './playback.module.scss';
import usePlaybackManager from '@/app/hooks/usePlaybackManager';
import PlaybackButton from './PlaybackButton';
import { useErrorModalContext } from '../../contexts/ErrorModalContext';

const AUDIO_URL = 's3://verbano-dev-audio/audio-files/1696394886454.wav';

const Playback: React.FC = () => {
  const { startPlayback, pausePlayback, playbackState } = usePlaybackManager();
  const { setIsError, setErrorMessage } = useErrorModalContext();

  const togglePlayback = async () => {
    try {
      switch (playbackState) {
        case 'idle':
        case 'paused':
          await startPlayback(AUDIO_URL);
          break;
        case 'playing':
          console.log('pausing');
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
