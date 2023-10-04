import React from 'react';
import styles from './playback.module.scss';

export interface PlaybackButtonProps {
  isPlaying: boolean;
  isPaused: boolean;
  isIdle: boolean;
  togglePlayback: () => void;
  theme?: 'light' | 'dark';
}

const PlaybackButton: React.FC<PlaybackButtonProps> = ({
  isPlaying,
  isPaused,
  isIdle,
  togglePlayback,
  theme = 'light', // Default to light theme if not provided
}) => (
  <button
    id={'playbackButton'}
    onClick={togglePlayback}
    className={`${styles.playbackButton} ${isPlaying ? styles.playing : '' } ${
      styles[theme]
    }`}
  >
    { buttonLabel(isPlaying, isPaused, isIdle) }
  </button>
);

function buttonLabel(isPlaying: boolean, isPaused: boolean, isIdle: boolean): string {
  if (isPlaying)
    return 'Pause'
  else if (isPaused)
    return 'Resume'
  else if (isIdle)
    return 'Play'

  return ''
}

export default PlaybackButton;
