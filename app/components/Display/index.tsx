import React from 'react';
import Box from '@mui/material/Box';
import styles from './display.module.scss';
import Typography from '@mui/material/Typography';

type DisplayProps = {
  title: string | undefined;
  content: string;
};

function Display({ title, content }: DisplayProps) {
  return (
    <Box className={styles.display}>
      <Typography variant={'h5'}>{title}</Typography>
      <Typography variant={'body1'}> {content}</Typography>
    </Box>
  );
}

export default Display;
