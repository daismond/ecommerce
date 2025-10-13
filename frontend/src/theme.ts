import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // A classic, elegant blue
    },
    secondary: {
      main: '#f50057', // A vibrant pink for accents
    },
    background: {
      default: '#f9f9f9', // A very light grey, almost white
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
        fontWeight: 600,
    },
    h2: {
        fontWeight: 600,
    },
    h3: {
        fontWeight: 600,
    },
    h4: {
        fontWeight: 600,
    },
    h5: {
        fontWeight: 500,
    },
    h6: {
        fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
                }
            }
        }
    },
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                fontWeight: 600,
            }
        }
    }
  }
});

export default theme;
