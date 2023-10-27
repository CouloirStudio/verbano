import React from 'react';
import Box from '@mui/material/Box';
import styles from './display.module.scss';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

type DisplayProps = {
  title: string | undefined;
  content: string;
};

function Display({ title, content }: DisplayProps) {
  const theme = useTheme();
  return (
    <Box
      className={styles.display}
      style={{
        color: theme.custom?.text ?? '',
      }}
    >
      <Typography variant={'h5'}>{title}</Typography>
      <Typography variant={'body1'}> {content}</Typography>
    </Box>
  );
}

export default Display;
