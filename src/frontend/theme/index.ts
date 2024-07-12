import { createTheme as createMuiTheme } from '@mui/material';
import { createPalette } from './create_palette';
import { createComponents } from './create_components';
import { createShadows } from './create_shadows';
import { createTypography } from './create_typography';

export function createTheme(isDarkMode: boolean) {
  const palette = createPalette(isDarkMode);
  const components = createComponents({ palette });
  const shadows = createShadows();
  const typography = createTypography();

  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440
      }
    },
    components,
    palette,
    shadows,
    shape: {
      borderRadius: 8
    },
    typography
  });
}
