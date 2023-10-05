import React from 'react';
import styles from './playback.module.scss';
import usePlaybackManager from '@/app/hooks/usePlaybackManager';
import PlaybackButton from './PlaybackButton';

const Playback: React.FC = () => {
  const { startPlayback, pausePlayback, playbackState } = usePlaybackManager();
  const togglePlayback = async () => {
    try {
      if (playbackState === 'idle' || playbackState === 'paused') {
        await startPlayback(
          's3://verbano-dev-audio/audio-files/1696394886454.wav',
        );
      } else if (playbackState === 'playing') {
        console.log('pausing');
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
          isPaused={playbackState === 'paused'}
          isIdle={playbackState == 'idle'}
          togglePlayback={togglePlayback}
        />
      )}
    </div>
  );
};

export default Playback;
