import React from 'react';
import styles from './playback.module.scss';

export interface PlaybackButtonProps {
  isPlaying: boolean;
  togglePlayback: () => void;
  theme?: 'light' | 'dark';
}

const PlaybackButton: React.FC<PlaybackButtonProps> = ({
  isPlaying,
  togglePlayback,
  theme = 'light', // Default to light theme if not provided
}) => (
  <button
    id={'playbackButton'}
    onClick={togglePlayback}
    className={`${styles.playbackButton} ${isPlaying ? styles.playing : ''} ${
      styles[theme]
    }`}
  >
    {isPlaying ? 'Pause' : 'Play'}
  </button>
);

export default PlaybackButton;
