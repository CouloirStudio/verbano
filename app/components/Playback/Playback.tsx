import React from "react";
import styles from "./playback.module.scss";
import usePlaybackManager from "@/app/hooks/usePlaybackManager";
import PlaybackButton from "./PlaybackButton";
import { useErrorModalContext } from "../../contexts/ErrorModalContext";

/**
 * Update these constants depending on environment.
 * AUDIO_URL is the AWS S3 url that will be used to retrieve an audio file.
 * BASE_URL is the base of the url where the request to retrieve the audio will be sent.
 */
const AUDIO_URL = 's3://verbano-dev-audio/audio-files/1696394886454.wav';
const BASE_URL = 'http://localhost:3000';

/**
 * Playback component that houses the Playback Button.
 * This component handles the togglePlayback function.
 * @constructor
 */
const Playback: React.FC = () => {
  const { startPlayback, pausePlayback, playbackState } = usePlaybackManager();
  const { setIsError, setErrorMessage } = useErrorModalContext();

  /**
   * TogglePlayback makes calls to pause/start the audio depending on playbackstate.
   * It also manages any uncaught errors that may arise, activating the errormodal component.
   */
  const togglePlayback = async () => {
    try {
      switch (playbackState) {
        case 'idle':
        case 'paused':
          await startPlayback(BASE_URL, AUDIO_URL);
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
