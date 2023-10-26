import React, {
  FunctionComponent,
  createContext,
  useContext,
  useState,
} from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { lightTheme, darkTheme } from '@/styles/theme';

/**
 * Type definition for the theme context.
 */
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

/**
 * Creating a context for theme management.
 */
const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * Type definition for the props of the CustomThemeProvider component.
 */
interface CustomThemeProviderProps {
  children: React.ReactNode;
}

/**
 * A provider component for the application theme.
 * It wraps its children with a Material-UI ThemeProvider.
 *
 * @param {CustomThemeProviderProps} props - The props for the component.
 */
const CustomThemeProvider: FunctionComponent<CustomThemeProviderProps> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  /**
   * Toggles the theme between light and dark modes.
   */
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={currentTheme}>
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
};

/**
 * Custom hook to use the theme context.
 * It ensures that the context is used within a provider.
 *
 * @throws Will throw an error if used outside of CustomThemeProvider.
 * @returns {ThemeContextType} The theme context.
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useThemeContext must be used within a CustomThemeProvider',
    );
  }

  return context;
};

export default CustomThemeProvider;
