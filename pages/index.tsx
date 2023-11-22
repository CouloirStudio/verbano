import { useProjectContext } from '@/app/contexts/ProjectContext';
import styles from '@/pages/styles/noteDashboard.module.scss';
import TranscriptionDisplay from '@/app/components/Audio/Transcription/TranscriptionDisplay';
import { NoteContextProvider } from '@/app/contexts/NoteContext';
import { AudioHeader } from '@/app/components/Audio/AudioHeader';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Fade, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import TakingNotesSVG from '@/app/components/UI/SVGs/TakingNotesSVG';

export default function Home() {
  const { selectedNote } = useProjectContext();
  const theme = useTheme();
  const backgroundColour = theme.custom?.mainBackground ?? '';
  return (
    <div className={styles.container}>
      <Box
        className={styles.noteWrapper}
        sx={{ backgroundColor: backgroundColour }}
      >
        {selectedNote && (
          <NoteContextProvider>
            <AudioHeader />
            <TranscriptionDisplay />
          </NoteContextProvider>
        )}
        {!selectedNote && (
          <Fade in={true}>
            <Stack
              height={'80%'}
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              textAlign={'center'}
              spacing={2}
            >
              <Typography variant={'h1'} color="text.primary">
                Welcome to Verbano!
              </Typography>
              <Typography variant={'h4'} color="text.primary">
                Start by entering a project
              </Typography>
              <TakingNotesSVG />
            </Stack>
          </Fade>
        )}
      </Box>
    </div>
  );
}
