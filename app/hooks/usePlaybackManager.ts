import { useState } from 'react';
import { getAudioFromS3 } from '../services/AWSService';
import { useErrorModalContext } from '../contexts/ErrorModalContext';
import { AudioPlayer } from '@/app/api/playback';

const usePlaybackManager = () => {
  const { setErrorMessage, setIsError } = useErrorModalContext();

  const [playbackState, setPlaybackState] = useState<
    'idle' | 'playing' | 'processing'
  >('idle');

  let audioPlayer: AudioPlayer | undefined;
  const handleError = (error: any) => {
    console.error(error);
    setErrorMessage(`${error.message}`);
    setIsError(true);
    setPlaybackState('idle');
  };

  const startPlayback = async () => {
    try {
      audioPlayer = AudioPlayer.getAudioPlayer();
      setPlaybackState('processing');
      const source = await getAudioFromS3(
        's3://verbano-dev-audio/audio-files/1696394886454.wav',
      );
      const blobURL = URL.createObjectURL(source);
      await audioPlayer.loadAudioPlayer(blobURL);
      audioPlayer.audio?.addEventListener('ended', () => {
        setPlaybackState('idle');
      });
      await audioPlayer.startAudioPlayer();
      setPlaybackState('playing');
    } catch (error) {
      handleError(error);
    }
  };

  const pausePlayback = async () => {
    audioPlayer?.pauseAudioPlayer();
    setPlaybackState('idle');
  };

  return {
    startPlayback,
    pausePlayback,
    playbackState,
  };
};

export default usePlaybackManager;
