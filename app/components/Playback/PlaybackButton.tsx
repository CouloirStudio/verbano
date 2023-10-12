import React from 'react';
import styles from './playback.module.scss';

enum PlaybackState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  IDLE = 'idle',
}

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
      onClick={togglePlayback}
      className={`${playbackButton} ${
        playbackState === PlaybackState.PLAYING ? playing : ''
      } ${theme === 'light' ? light : dark}`}
    >
      {getButtonLabel(playbackState)}
    </button>
  );
};

function getButtonLabel(playbackState: PlaybackState): string {
  switch (playbackState) {
    case PlaybackState.PLAYING:
      return 'Pause';
    case PlaybackState.PAUSED:
      return 'Resume';
    case PlaybackState.IDLE:
      return 'Play';
    default: {
      console.log('invalid state passed' + playbackState);
      return 'error';
    }
  }
}

export default PlaybackButton;
