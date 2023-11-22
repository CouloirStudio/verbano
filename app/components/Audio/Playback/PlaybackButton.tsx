import React from 'react';
import styles from './playback.module.scss';
import { PlaybackState } from '@/app/hooks/usePlaybackManager';
import Image from 'next/image';

export interface PlaybackButtonProps {
  playbackState: PlaybackState;
  togglePlayback: () => void;
  theme?: 'light' | 'dark';
}

const PlaybackButton: React.FC<PlaybackButtonProps> = ({
  playbackState,
  togglePlayback,
}) => {
  const { playbackButton } = styles;

  return (
    <button onClick={togglePlayback} className={`${playbackButton}`}>
      {getButtonIcon(playbackState)}
    </button>
  );
};

function getButtonIcon(playbackState: PlaybackState): JSX.Element {
  switch (playbackState) {
    case PlaybackState.PLAYING:
      return (
        <Image
          src="/icons/Pause-Button.svg"
          alt="Pause"
          width={163}
          height={42}
        />
      );
    case PlaybackState.PAUSED:
      return (
        <Image
          src="/icons/Resume-Button.svg"
          alt="Resume"
          width={163}
          height={42}
        />
      );
    case PlaybackState.IDLE:
      return (
        <Image
          id={'playButton'}
          src="/icons/Play-Button.svg"
          alt="Play"
          width={163}
          height={42}
        />
      );
    default:
      console.log('Invalid state passed: ' + playbackState);
      return <div>Error</div>;
  }
}

export default PlaybackButton;
