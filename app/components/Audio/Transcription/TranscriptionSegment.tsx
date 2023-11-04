import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {IoPersonOutline} from 'react-icons/io5';
import useFormatTimestamp from '@/app/hooks/useFormatTimestamp'; // Import the hook
import styles from './transcription.module.scss';

// Define the type for the segment prop
interface TranscriptionSegmentProps {
  segment: {
    start: number;
    text: string;
  };
}

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
