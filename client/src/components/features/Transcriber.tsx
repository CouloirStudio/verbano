import React from 'react';
import { useWhisper } from '../../hooks/useWhisper';
import styles from "../../styles/pages/index.module.scss";

const Transcriber: React.FC = () => {
  const { getTranscription } = useWhisper();
  
  const transcribeAudio = async () => {
    try {
      await getTranscription();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.transcriber}>
      <button onClick={transcribeAudio} className={styles.button}>Transcribe Audio</button>
    </div>
  );
};

export default Transcriber;
