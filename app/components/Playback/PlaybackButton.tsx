import React from 'react';
import styles from './playback.module.scss';

export type PlaybackState = 'playing' | 'paused' | 'idle';

export interface PlaybackButtonProps {
  playbackState: PlaybackState;
  togglePlayback: () => void;
  theme?: 'light' | 'dark';
}

const PlaybackButton: React.FC<PlaybackButtonProps> = ({
  playbackState,
  togglePlayback,
  theme = 'light',
}) => {
  const { playbackButton, playing, light, dark } = styles;

  return (
    <button
      id="playbackButton"
      onClick={togglePlayback}
      className={`${playbackButton} ${
        playbackState === 'playing' ? playing : ''
      } ${theme === 'light' ? light : dark}`}
    >
      {getButtonLabel(playbackState)}
    </button>
  );
};

function getButtonLabel(playbackState: PlaybackState): string {
  switch (playbackState) {
    case 'playing':
      return 'Pause';
    case 'paused':
      return 'Resume';
    case 'idle':
      return 'Play';
    default:
      return '';
  }
}

export default PlaybackButton;
