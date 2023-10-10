import { useEffect, useRef, useState } from "react";
import { getAudio } from "../api/audio";
import { useErrorModalContext } from "../contexts/ErrorModalContext";
import { AudioPlayer } from "@/app/api/playback";

// Define possible states of the playback
type PlaybackStateType = 'idle' | 'playing' | 'processing' | 'paused';

/**
 * Custom hook to manage audio playback and related states.
 */
const usePlaybackManager = () => {
  // Context to handle error messages in a modal
  const { setErrorMessage, setIsError } = useErrorModalContext();

  // Playback state management
  const [playbackState, setPlaybackState] = useState<PlaybackStateType>('idle');

  // Reference to the audio player instance for persistent state
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
    setPlaybackState('idle');
  };

  const onEnd = () => {
    setPlaybackState('idle');
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
  const startPlayback = async (url: string, audioURL: string) => {
    try {
      if (!audioPlayerRef.current.isLoaded) {
        setPlaybackState('processing');
        const source = await getAudio(url, audioURL);
        const blobURL = URL.createObjectURL(source);
        console.log('audio gotten');
        await audioPlayerRef.current.loadAudioPlayer(blobURL);
        console.log('audio loaded');
      }
      audioPlayerRef.current.audio?.addEventListener('ended', onEnd);
      await audioPlayerRef.current.startAudioPlayer();
      setPlaybackState('playing');
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
      setPlaybackState('paused');
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
