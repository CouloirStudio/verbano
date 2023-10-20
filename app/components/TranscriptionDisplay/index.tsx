import styles from "./transcriptiondisplay.module.scss";
import { useProjectContext } from "../../contexts/ProjectContext";
import { GET_TRANSCRIPTION } from "../../../app/graphql/queries/getNotes";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * A functional component to display a single transcription.
 *
 */
function TranscriptionDisplay() {
  const context = useProjectContext();

  const selectedNote = context.selectedNote;

  if (!selectedNote) {
    console.log('not note selected');
  }

  const { data, error } = useQuery<{ getTranscription: string }>(
    GET_TRANSCRIPTION,
    {
      variables: {
        id: selectedNote?.id,
      },
    },
  );

  if (error) {
    console.log(error);
  }

  const getTranscription = (): string => {
    if (data && data.getTranscription && data.getTranscription) {
      return data.getTranscription;
    }
    return 'No Transcription';
  };

  return (
    <Box className={styles.transcription}>
      <Typography variant={'h4'}>{selectedNote?.noteName}</Typography>
      <Typography variant={'body1'}> {getTranscription()}</Typography>
    </Box>
  );
}

export default TranscriptionDisplay;
