import styles from "./transcription.module.scss";
import { useProjectContext } from "../../../contexts/ProjectContext";
import GetTranscription from "@/app/graphql/queries/GetTranscription";
import Box from "@mui/material/Box";
import { useErrorModalContext } from "@/app/contexts/ErrorModalContext";
import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useNoteContext } from "@/app/contexts/NoteContext";
import Display from "@/app/components/UI/Display";
import ScrollView from "@/app/components/UI/ScrollView";
import Footer from "@/app/components/Layout/Footer";

/**
 * A functional component to display a transcription.
 * @constructor
 */
const TranscriptionDisplay: React.FC = () => {
  const { selectedNote } = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const { transcription, setTranscription } = useNoteContext();

  // Use GraphQL to get the transcription
  const [getTranscript, { data }] = useLazyQuery(GetTranscription);

  // Perform these actions when the component is rendered
  useEffect(() => {
    // Check for existing transcription

    if (!selectedNote?.id) return;

    getTranscript({ variables: { id: selectedNote.id } });

    if (data && data.getTranscription) {
      try {
        const transcriptionData = JSON.parse(data.getTranscription);
        setTranscription(transcriptionData.text); // Update the transcription in the context
      } catch (error) {
        setIsError(true);
        if (typeof error === 'object' && error !== null && 'message' in error) {
          setErrorMessage(`${(error as Error).message}`);
        } else {
          setErrorMessage(`An unknown error occurred.`);
        }
      }
    } else {
      setTranscription('');
    }
  }, [
    data,
    setTranscription,
    setIsError,
    setErrorMessage,
    selectedNote?.id,
    getTranscript,
  ]);

  return (
    <Box className={styles.transcription}>
      <ScrollView className={styles.scrollView}>
        <Display content={transcription} title={selectedNote?.noteName} />
      </ScrollView>
      <Footer footerText={transcription} />
    </Box>
  );
};

export default TranscriptionDisplay;
