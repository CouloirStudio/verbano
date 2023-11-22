import React from 'react';
import styles from './playback.module.scss';
import { PlaybackState } from '@/app/hooks/usePlaybackManager';
import Image from 'next/image';

export interface PlaybackButtonProps {
  playbackState: PlaybackState;
  togglePlayback: () => void;
  theme?: 'light' | 'dark';
}

/**
 * PlaybackButton is a React functional component that renders a button
 * to control audio playback. The button's icon changes based on the current playback state.
 *
 * @param {PlaybackButtonProps} props - The props for the PlaybackButton component.
 * @param {PlaybackState} props.playbackState - The current state of playback.
 * @param {() => void} props.togglePlayback - A function to toggle the playback state.
 * @param {"light" | "dark"} [props.theme] - Optional theme for the button.
 */

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

/**
 * Returns the appropriate icon for the playback button based on the current playback state.
 *
 * @param {PlaybackState} playbackState - The current state of playback.
 * @returns {JSX.Element} - The JSX Element representing the button icon.
 */
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
