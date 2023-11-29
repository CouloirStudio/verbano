import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useFormatTimestamp from '@/app/hooks/useFormatTimestamp'; // Import the hook
import styles from './transcription.module.scss';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { RiSpeakLine } from 'react-icons/ri';

/**
 * `TranscriptionSegmentProps` defines the properties that the `TranscriptionSegment` component expects.
 * `segment` is an object containing the `start` time of the transcription segment and the `text` of the transcription.
 */
interface TranscriptionSegmentProps {
  segment: {
    id: number;
    end: number;
    start: number;
    text: string;
    tokens: number[];
    avgLogProb: number;
    temperature: number;
    noSpeechProb: number;
    compressionRatio: number;
  };
}

/**
 * `TranscriptionSegment` is a React functional component that renders an individual segment of a transcription.
 * It displays a formatted timestamp and the text of the transcription segment.
 * The timestamp is formatted using the `useFormatTimestamp` hook.
 *
 * @param {TranscriptionSegmentProps} props - The props object for this component, expecting a single `segment` prop.
 * @returns {React.ReactElement} - A React element representing the transcription segment.
 */
const TranscriptionSegment: React.FC<TranscriptionSegmentProps> = ({
  segment,
}) => {
  const formatTimestamp = useFormatTimestamp();
  const theme = useTheme();

  return (
    <Box>
      <Stack direction={'column'} className={styles.segment} spacing={1}>
        <Stack direction={'row'} spacing={1} alignItems={'middle'}>
          <RiSpeakLine size={24} />
          <Typography variant={'subtitle2'}>
            {formatTimestamp(segment.start)}
          </Typography>
        </Stack>
        <Box
          className={styles.content}
          sx={{ backgroundColor: theme.custom?.contrastBackground }}
        >
          <Typography variant="body1">{segment.text}</Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default TranscriptionSegment;
