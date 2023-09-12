import React, { useState } from 'react';
import styles from './recorder.module.scss';

const Recorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // TODO: Implement the actual recording functionality.
    };

    return (
        <div className={styles.recorder}>
            <button 
                onClick={toggleRecording} 
                className={`${styles.recorderButton} ${isRecording ? styles.recording : ''}`}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
        </div>
    );
};

export default Recorder;
