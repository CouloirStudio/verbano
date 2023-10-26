import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom?: {
      headerBackground?: string;
      mainBackground?: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: {
      headerBackground?: string;
      mainBackground?: string;
    };
  }
}
