import styles from "./transcriptiondisplay.module.scss";
import { useProjectContext } from "../../contexts/ProjectContext";
import { GET_TRANSCRIPTION } from "../../../app/graphql/queries/getNotes";
import { useQuery } from "@apollo/react-hooks";

/**
 * Props for the TranscriptionDisplay component.
 */
type displayProps = {
  /** Name of the note. */
  noteID: string;
};

/**
 * A functional component to display a single transcription.
 *
 * @param noteID - The ID of the note to get the transcription for
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

  return <div className={styles.transcription}>{getTranscription()}</div>;
}

export default TranscriptionDisplay;
