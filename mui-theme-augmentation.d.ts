import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom?: {
      [key: string]: string | undefined;
    };
  }

  // Allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: {
      [key: string]: string | undefined;
    };
  }
}
