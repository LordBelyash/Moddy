// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const myTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e11d48',
    },
    background: {
      default: '#1c1917',
      paper: '#1c1917',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
        },
      },
    },
  },
});
