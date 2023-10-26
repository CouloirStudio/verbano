import { createTheme, darken, ThemeOptions } from '@mui/material/styles';

interface CustomThemeOptions extends ThemeOptions {
  custom?: {
    headerBackground?: string;
    mainBackground?: string;
    contrastBackground?: string;
    moreContrastBackground?: string;
    text?: string;
    logoColour?: string;
  };
}

// Shared Colors
const primaryColor = '#68bbca';
const primaryContrastText = '#fafafa';
const secondaryColor = '#9083d4';
const successColor = '#68caa8';
const infoColor = '#688aca';
const warningColor = '#ca7768';
const errorColor = '#ca686a';
const white = '#FFFFFF';
const black = '#000000';

// Shared Typography
const quicksand = '"Quicksand", "Helvetica", "Arial", sans-serif';
const urbanist = '"Urbanist", "Helvetica", "Arial", sans-serif';
const epilogue = '"Epilogue", "Helvetica", "Arial", sans-serif';

const commonTypography = {
  h1: { fontFamily: quicksand },
  h2: { fontFamily: quicksand },
  h3: { fontFamily: quicksand },
  h4: { fontFamily: quicksand },
  h5: { fontFamily: quicksand },
  h6: { fontFamily: quicksand },
  fontFamily: urbanist,
  subtitle1: { fontFamily: urbanist },
  button: {
    fontFamily: epilogue,
    fontSize: '1rem',
    lineHeight: 1.85,
    fontWeight: 500,
  },
  overline: { fontFamily: quicksand },
};

// Light Theme Options
export const lightThemeOptions: CustomThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: primaryColor, contrastText: primaryContrastText },
    secondary: { main: secondaryColor },
    success: { main: successColor },
    info: { main: infoColor },
    warning: { main: warningColor },
    error: { main: errorColor },
  },
  custom: {
    headerBackground: primaryColor,
    mainBackground: white,
    contrastBackground: '#FAFAFA',
    moreContrastBackground: '#EEEEEE',
    text: black,
    logoColour: primaryContrastText,
  },
  typography: commonTypography,
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '8px',
          borderRadius: '50%',
          '&.roundedPrimary': {
            backgroundColor: primaryColor,
            color: primaryContrastText,
            '&:hover': {
              backgroundColor: darken(primaryColor, 0.2),
            },
          },
        },
      },
    },
  },
};

// Dark Theme Options
export const darkThemeOptions: CustomThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: primaryColor, contrastText: primaryContrastText },
    secondary: { main: secondaryColor },
    success: { main: successColor },
    info: { main: infoColor },
    warning: { main: warningColor },
    error: { main: errorColor },
  },
  custom: {
    headerBackground: '#272727',
    mainBackground: '#2F2F2F',
    contrastBackground: '#1E1E1E',
    moreContrastBackground: '#121212',
    text: white,
    logoColour: primaryColor,
  },
  typography: commonTypography,
};

// Create themes from the options
export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);
