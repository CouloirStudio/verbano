import { useState } from 'react';
import { getAudioFromS3 } from '../services/AWSService';
import { useErrorModalContext } from '../contexts/ErrorModalContext';
import { AudioPlayer } from '@/app/api/playback';

const usePlaybackManager = () => {
  const { setErrorMessage, setIsError } = useErrorModalContext();
  // Save the state of the playback
  const [playbackState, setPlaybackState] = useState<
    'idle' | 'playing' | 'processing' | 'paused'
  >('idle');

  // Save the state of the audio player
  const[audioPlayer, setAudioPlayer] = useState<AudioPlayer>(new AudioPlayer());

  // Handle any errors that may come up
  const handleError = (error: any) => {
    console.error(error);
    setErrorMessage(`${error.message}`);
    setIsError(true);
    setPlaybackState('idle');
  };

  // This method gets called when play or resume is hit
  // It also handles loading the Audio Player when the play button is first hit.
  const startPlayback = async () => {
    try {
        // Check if it is already loaded before loading it with new data
        if (!audioPlayer.isLoaded) {
          setPlaybackState('processing');
          // get the audio from S3 and make it into a blob URL for the audio element to use.
          const source = await getAudioFromS3(
            's3://verbano-dev-audio/audio-files/1696394886454.wav',
          );
          const blobURL = URL.createObjectURL(source);
          //load the audio player with data
          await audioPlayer.loadAudioPlayer(blobURL);
        }

      // listen for when playback ends to update state
      const onEnd = () =>{
        setPlaybackState('idle');
        audioPlayer.audio?.removeEventListener('ended', onEnd);
      }
      audioPlayer.audio?.addEventListener('ended', onEnd);
        //start the audio player
      await audioPlayer.startAudioPlayer();
      setPlaybackState('playing');
    } catch (error) {
      handleError(error);
    }

  };

  // Pause the Audio Player and update state
  const pausePlayback = async () => {
    try{
        audioPlayer.pauseAudioPlayer();
        setPlaybackState('paused');
    }catch(error){
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
