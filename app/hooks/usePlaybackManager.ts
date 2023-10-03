import { useState } from 'react';
import { getAudioFromS3 } from '../services/AWSService';
import { useErrorModalContext } from '../contexts/ErrorModalContext';

const usePlaybackManager = () => {
  const { setErrorMessage, setIsError } = useErrorModalContext();

  const [playbackState, setPlaybackState] = useState<
    'idle' | 'playing' | 'processing'
  >('idle');

  const handleError = (error: any) => {
    console.error(error);
    setErrorMessage(`${error.message}`);
    setIsError(true);
    setPlaybackState('idle');
  };

  const startPlayback = async () => {
    try {
      await getAudioFromS3();
      setPlaybackState('playing');
    } catch (error) {
      handleError(error);
    }
  };

  const pausePlayback = async () => {
    setPlaybackState('idle');
  };

  return {
    startPlayback,
    pausePlayback,
    playbackState,
  };
};

export default usePlaybackManager;
