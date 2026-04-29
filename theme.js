import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const baseTheme = (mode, direction) => ({
  palette: {
    mode,
    primary: {
      main: mode === "dark" ? "#00f0ff" : "#0077b6",
      light: mode === "dark" ? "#66ffff" : "#00b4d8",
      dark: mode === "dark" ? "#00b4d8" : "#023e8a",
      contrastText: mode === "dark" ? "#0a0a0a" : "#ffffff",
    },
    secondary: {
      main: mode === "dark" ? "#7b2ff7" : "#7b2ff7",
      light: mode === "dark" ? "#a66eff" : "#9d4edd",
      dark: mode === "dark" ? "#5a1db8" : "#5a1db8",
      contrastText: "#ffffff",
    },
    success: {
      main: mode === "dark" ? "#00ff88" : "#2e7d32",
      light: mode === "dark" ? "#66ffbb" : "#4caf50",
      dark: mode === "dark" ? "#00cc6a" : "#1b5e20",
    },
    warning: {
      main: mode === "dark" ? "#ffaa00" : "#ed6c02",
      light: mode === "dark" ? "#ffcc66" : "#ff9800",
      dark: mode === "dark" ? "#cc8800" : "#e65100",
    },
    error: {
      main: mode === "dark" ? "#ff4757" : "#d32f2f",
      light: mode === "dark" ? "#ff7983" : "#ef5350",
      dark: mode === "dark" ? "#cc3944" : "#c62828",
    },
    background: {
      default: mode === "dark" ? "#0a0a0f" : "#f0f2f5",
      paper: mode === "dark" ? "#12121a" : "#ffffff",
    },
    text: {
      primary: mode === "dark" ? "#e0e0e0" : "#1a1a2e",
      secondary: mode === "dark" ? "#a0a0a0" : "#5a5a7a",
    },
  },
  direction,
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow:
            mode === "dark"
              ? "0 4px 24px rgba(0, 240, 255, 0.08), 0 0 40px rgba(123, 47, 247, 0.04)"
              : "0 4px 24px rgba(0, 0, 0, 0.06), 0 0 40px rgba(0, 0, 0, 0.02)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            boxShadow:
              mode === "dark"
                ? "0 8px 32px rgba(0, 240, 255, 0.12), 0 0 60px rgba(123, 47, 247, 0.06)"
                : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 60px rgba(0, 0, 0, 0.03)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          fontSize: "0.95rem",
        },
        contained: {
          boxShadow: mode === "dark" ? "0 0 20px rgba(0, 240, 255, 0.2)" : "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 10,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            mode === "dark"
              ? "0 2px 20px rgba(0, 240, 255, 0.1)"
              : "0 2px 20px rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(10px)",
        },
      },
    },
  },
});

export const getTheme = (mode, direction) =>
  responsiveFontSizes(createTheme(baseTheme(mode, direction)));
