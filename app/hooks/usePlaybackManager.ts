import { useEffect, useRef, useState } from 'react';
import { useErrorModalContext } from '../contexts/ErrorModalContext';
import { AudioPlayer } from '@/app/api/playback';

export enum PlaybackState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  IDLE = 'idle',
  PROCESSING = 'processing',
}

/**
 * Custom hook to manage audio playback and related states.
 */
const usePlaybackManager = () => {
  // Context to handle error messages in a modal
  const { setErrorMessage, setIsError } = useErrorModalContext();

  // create type for playbackState

  // Playback state management
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    PlaybackState.IDLE,
  );

  // A single AudioPlayer object is used throughout the hook and needs to have a persistent state throughout the lifetime of the component.
  const audioPlayerRef = useRef(new AudioPlayer());

  /**
   * Unified error handling.
   * Logs error to console, displays an error message, and resets playback state.
   */
  const handleError = (error: unknown) => {
    console.error(error);
    if (error instanceof Error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('An unexpected error occurred.');
    }
    setIsError(true);
    setPlaybackState(PlaybackState.IDLE);
  };

  const onEnd = () => {
    setPlaybackState(PlaybackState.IDLE);
    audioPlayerRef.current.audio?.removeEventListener('ended', onEnd);
  };

  // Effect to handle playback ending: cleanup listeners for performance
  useEffect(() => {
    const currentAudioPlayer = audioPlayerRef.current;

    // Cleanup the listener when the component is unmounted
    return () => {
      currentAudioPlayer.audio?.removeEventListener('ended', onEnd);
    };
  }, []);

  /**
   * Starts or resumes audio playback.
   * Handles loading of audio data if the player is not already loaded.
   */
  const startPlayback = async (audioKey: string) => {
    try {
      if (!audioPlayerRef.current.isLoaded) {
        setPlaybackState(PlaybackState.PROCESSING);

        // Generate the pre-signed URL for the audio file using the S3 object key
        const response = await fetch(`/api/getPresignedUrl/${audioKey}`);
        if (!response.ok) {
          throw new Error('Failed to retrieve pre-signed URL.');
        }
        const data = await response.json();
        const blobURL = data.url;

        await audioPlayerRef.current.loadAudioPlayer(blobURL);
      }

      audioPlayerRef.current.audio?.addEventListener('ended', onEnd);
      await audioPlayerRef.current.startAudioPlayer();
      setPlaybackState(PlaybackState.PLAYING);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Pauses audio playback and updates state.
   */
  const pausePlayback = async () => {
    try {
      audioPlayerRef.current.pauseAudioPlayer();
      setPlaybackState(PlaybackState.PAUSED);
    } catch (error) {
      handleError(error);
    }
  };

  return {
    startPlayback,
    pausePlayback,
    playbackState,
  };
};

export default usePlaybackManager;
