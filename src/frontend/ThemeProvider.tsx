import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import { createTheme } from './theme';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDarkMode } = useSelector((state: any) => state.uiReducer);
  const theme: Theme = createTheme(isDarkMode);

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;