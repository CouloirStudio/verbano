import styles from './transcriptiondisplay.module.scss';
import {useProjectContext} from '../../contexts/ProjectContext';
import {GET_TRANSCRIPTION} from '../../../app/graphql/queries/getNotes';
import {useQuery} from '@apollo/react-hooks';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useErrorModalContext} from '@/app/contexts/ErrorModalContext';

/**
 * A functional component to display a single transcription.
 *
 */
function TranscriptionDisplay() {
  const context = useProjectContext();
  const { setErrorMessage, setIsError } = useErrorModalContext();
  const selectedNote = context.selectedNote;

  if (!selectedNote) return <Box className={styles.transcription}>)</Box>;

  // Use GraphQL to get the transcription
  const { data, error } = useQuery(GET_TRANSCRIPTION, {
    variables: {
      id: selectedNote.id,
    },
  });

  if (error) {
    console.log(error);
  }

  const getTranscription = (): string => {
    try {
      if (data && data.getTranscription && data.getTranscription) {
        // Parse json so that we can get the text
        const transcription = JSON.parse(data.getTranscription);
        return transcription.text;
      }
    } catch (error) {
      setIsError(true);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setErrorMessage(`${(error as Error).message}`);
      } else {
        setErrorMessage(`An unknown error occurred.`);
      }
      return 'Error retrieving transcription. ';
    }
    return 'No Transcription.';
  };

  return (
    <Box className={styles.transcription}>
      <Typography variant={'h5'}>{selectedNote?.noteName}</Typography>
      <Typography variant={'body1'}> {getTranscription()}</Typography>
    </Box>
  );
}

export default TranscriptionDisplay;
