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
 * Custom hook to manage the current audio element, and the state of the playback component.
 */
const usePlaybackManager = () => {
  // Context to handle error messages in a modal
  const { setErrorMessage, setIsError } = useErrorModalContext();

  // Playback state management for the playback component only
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    PlaybackState.IDLE,
  );

  /**
   * A single AudioPlayer object is used throughout the hook and needs to have a persistent state throughout the lifetime of the component.
   * We only want one audio element at a time.
   */
  const audioPlayerRef = useRef<AudioPlayer>(new AudioPlayer());

  /**
   * A reference to the source of the audio player, this will be compared against to manage the state of the playback component.
   */
  const currentAudioSourceRef = useRef<string | null>(null);

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
      // if the player is not loaded, or if the audio key has changed, then load it again.
      if (
        !currentAudioPlayer.isLoaded ||
        currentAudioSourceRef.current != audioKey
      ) {
        // updating reference
        currentAudioSourceRef.current = audioKey;
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

  /**
   * This is called from the playback component if the selected note matches the currently playing audio element.
   * From the state of the audio element, we can make the state of the playback component match the current audio element.
   */
  const updateStateFromPlayer = () => {
    if (audioPlayerRef.current) {
      // These statements MUST stay in order.
      // When an audio element hs ended it is also paused.
      // But if it is paused, it is not always ended.
      if (audioPlayerRef.current.audio?.ended)
        setPlaybackState(PlaybackState.IDLE);
      else if (audioPlayerRef.current.audio?.paused)
        setPlaybackState(PlaybackState.PAUSED);
      else if (!audioPlayerRef.current.isLoaded)
        setPlaybackState(PlaybackState.PROCESSING);
      else setPlaybackState(PlaybackState.PLAYING);
    }
  };

  return {
    startPlayback,
    pausePlayback,
    playbackState,
    setPlaybackState,
    currentAudioSourceRef,
    updateStateFromPlayer,
  };
};

export default usePlaybackManager;
