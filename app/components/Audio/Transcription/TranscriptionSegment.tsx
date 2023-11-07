import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {IoPersonOutline} from 'react-icons/io5';
import useFormatTimestamp from '@/app/hooks/useFormatTimestamp'; // Import the hook
import styles from './transcription.module.scss';

/**
 * `TranscriptionSegmentProps` defines the properties that the `TranscriptionSegment` component expects.
 * `segment` is an object containing the `start` time of the transcription segment and the `text` of the transcription.
 */
interface TranscriptionSegmentProps {
  segment: {
    start: number;
    text: string;
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

  return (
    <Paper className={styles.segment} elevation={1}>
      <Box className={styles.avatarBox}>
        <IoPersonOutline size={24} />
      </Box>
      <Box>
        <Typography variant={'subtitle2'}>
          {formatTimestamp(segment.start)}
        </Typography>
        <Typography variant="body1">{segment.text}</Typography>
      </Box>
    </Paper>
  );
};

export default TranscriptionSegment;
