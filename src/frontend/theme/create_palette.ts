import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { error, primary, info, neutral, success, warning } from './colors';

export function createPalette(isDarkMode) {
  if (isDarkMode) {
    return {
      action: {
        active: neutral[500],
        disabled: alpha(neutral[100], 0.38),
        disabledBackground: alpha(neutral[100], 0.12),
        focus: alpha(neutral[100], 0.16),
        hover: alpha(neutral[100], 0.04),
        selected: alpha(neutral[100], 0.12)
      },
      background: {
        default: '#121212',
        paper: '#1d1d1d'
      },
      divider: '#383838',
      error,
      info,
      mode: 'dark',
      neutral,
      primary: {
        lightest: '#E3F2F7',
        light: '#AED4E0',
        main: '#19738D',
        dark: '#125867',
        darkest: '#093542',
        contrastText: '#FFFFFF'
      },
      success,
      text: {
        primary: '#FFFFFF',
        secondary: alpha(common.white, 0.7),
        disabled: alpha(common.white, 0.5)
      },
      warning
    };
  } else {
    return {
      action: {
        active: neutral[500],
        disabled: alpha(neutral[900], 0.38),
        disabledBackground: alpha(neutral[900], 0.12),
        focus: alpha(neutral[900], 0.16),
        hover: alpha(neutral[900], 0.04),
        selected: alpha(neutral[900], 0.12)
      },
      background: {
        default: common.white,
        paper: common.white
      },
      divider: '#F2F4F7',
      error,
      info,
      mode: 'light',
      neutral,
      primary: {
        lightest: '#E3F2F7',
        light: '#AED4E0',
        main: '#19738D',
        dark: '#125867',
        darkest: '#093542',
        contrastText: '#FFFFFF'
      },
      success,
      text: {
        primary: neutral[900],
        secondary: neutral[500],
        disabled: alpha(neutral[900], 0.38)
      },
      warning
    };
  }
};