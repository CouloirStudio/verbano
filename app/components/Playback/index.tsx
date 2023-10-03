import React from 'react';
import styles from './playback.module.scss';
import usePlaybackManager from '@/app/hooks/usePlaybackManager';
import PlaybackButton from './PlaybackButton';

const Playback: React.FC = () => {
  const { startPlayback, pausePlayback, playbackState } = usePlaybackManager();
  const togglePlayback = async () => {
    try {
      if (playbackState === 'idle') {
        await startPlayback();
      } else if (playbackState === 'playing') {
        await pausePlayback();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.playback}>
      {playbackState === 'processing' ? (
        <span>Processing...</span>
      ) : (
        <PlaybackButton
          isPlaying={playbackState === 'playing'}
          togglePlayback={togglePlayback}
        />
      )}
    </div>
  );
};

export default Playback;
