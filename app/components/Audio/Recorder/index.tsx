import React from 'react';
import styles from './recorder.module.scss';
import RecordButton from './RecordButton';
import useAudioManager from '../../../hooks/useAudioManager';
import { NoteType, ProjectType } from '@/app/graphql/resolvers/types';

type RecorderProps = {
  refreshNoteDetails: () => void;
  selectedNote: NoteType | null;
  selectedProject: ProjectType | null;
};
const Recorder: React.FC<RecorderProps> = ({
  refreshNoteDetails,
  selectedNote,
  selectedProject,
}) => {
  const { startNewRecording, stopAndUploadRecording, recordingState } =
    useAudioManager();

  const toggleRecording = async () => {
    try {
      if (recordingState === 'idle') {
        await startNewRecording();
      } else if (recordingState === 'recording') {
        await stopAndUploadRecording(selectedProject, selectedNote);
        refreshNoteDetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.recorder}>
      {recordingState === 'processing' ? (
        <span>Processing...</span>
      ) : (
        <RecordButton
          isRecording={recordingState === 'recording'}
          toggleRecording={toggleRecording}
        />
      )}
    </div>
  );
};

export default Recorder;
