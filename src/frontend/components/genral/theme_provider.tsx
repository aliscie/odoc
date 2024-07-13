import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from "react-redux";

const Theme = (props) => {
    const { isDarkMode } = useSelector((state) => state.uiReducer);

    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            primary: {
                main: '#19738D', // Primary color
            },

            background: {
                default: isDarkMode ? '#121212' : '#ffffff',
                paper: isDarkMode ? '#1e1e1e' : '#ffffff',
            },
        },
        typography: {
            fontFamily: 'Inter, sans-serif',
            h1: {
                fontWeight: 600,
            },
            h2: {
                fontWeight: 600,
            },
            body1: {
                fontWeight: 400,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8, 
                        textTransform: 'none',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    );
}

export default Theme;
