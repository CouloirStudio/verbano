import { useEffect, useRef, useState } from 'react';
import { useErrorModalContext } from '../contexts/ErrorModalContext';
import { AudioPlayer } from '@/app/api/playback';
import { getAudio } from '@/app/api/audio';

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

  // Playback state management
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    PlaybackState.IDLE,
  );

  const currentAudioSourceRef = useRef<string | null>(null);

  /**
   * A single AudioPlayer object is used throughout the hook and needs to have a persistent state throughout the lifetime of the component.
   * This is done so that once the audio is loaded it does not have to be loaded again.
   */
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

  /**
   * Event listener that will set the state to idle when the audio finishes playing.
   * Triggered by the 'ended' event from the html audio element.
   */
  const onEnd = () => {
    setPlaybackState(PlaybackState.IDLE);
    //Before removing this, it wouldn't end after the second time playing audio
    // Yall are better experts, so I'll keep this here for someone to explain it to me if something else breaks
    //audioPlayerRef.current.audio?.removeEventListener('ended', onEnd);
  };

  /**
   *   Effect to handle playback ending: cleanup listeners for performance
   */
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
  const startPlayback = async (baseURL: string, audioKey: string) => {
    try {
      const currentAudioPlayer = audioPlayerRef.current;

      // If the audio source has changed, reset the current audio player
      if (currentAudioSourceRef.current !== audioKey) {
        if (currentAudioPlayer.isLoaded) {
          // Pause the current audio and reset the current time
          currentAudioPlayer.pauseAudioPlayer();
          if (currentAudioPlayer.audio) {
            currentAudioPlayer.audio.currentTime = 0;
          }
          currentAudioPlayer.audio?.removeEventListener('ended', onEnd);
          // Set the audio as not loaded for the new audioKey
          currentAudioPlayer.isLoaded = false;
        }
        currentAudioSourceRef.current = audioKey;
      }

      if (!currentAudioPlayer.isLoaded) {
        setPlaybackState(PlaybackState.PROCESSING);
        // Get signed URL from aws sdk
        const signedURL = await getAudio(baseURL, audioKey);
        // Load the audio player directly with the aws URL.
        await currentAudioPlayer.loadAudioPlayer(signedURL);
        currentAudioPlayer.audio?.addEventListener('ended', onEnd);
      }
      await currentAudioPlayer.startAudioPlayer();
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
