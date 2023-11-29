import Box from '@mui/material/Box';
import styles from './footer.module.scss';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTheme } from '@mui/material/styles';

export interface FooterProps {
  footerText: string;
}

/**
 *  A reusable footer component that word and character count of the given text.
 * @param footerText the text that the footer is showing data for
 */
const Footer: React.FC<FooterProps> = ({ footerText }) => {
  const theme = useTheme();
  /**
   * a function that counts the words and characters of the footer text.
   */
  const countWords = () => {
    // Made this function so it would not display a word if there are no characters
    const words = footerText.split(' ').length;
    const characters = footerText.length;

    if (words > 0 && characters > 0) return words;

    return 0;
  };

  return (
    <Box
      className={styles.footer}
      sx={{
        backgroundColor: theme.custom?.contrastBackground ?? '',
        color: theme.custom?.text ?? '',
      }}
    >
      <Box className={styles.footerContent}>
        <Typography variant="subtitle1">Source Mode</Typography>
        <>
          <Typography variant="subtitle1">Words: {countWords()}</Typography>
          <Typography variant="subtitle1">
            Characters: {footerText.length}
          </Typography>
        </>
      </Box>
    </Box>
  );
};

export default Footer;
