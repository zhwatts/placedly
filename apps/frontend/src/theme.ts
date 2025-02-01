/** @format */

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#64ffda",
      light: "#9effff",
      dark: "#14cba8",
    },
    background: {
      default: "transparent",
      paper: "transparent",
    },
    text: {
      primary: "#e6f1ff",
      secondary: "#8892b0",
    },
  },
  typography: {
    h4: {
      color: "#64ffda",
      fontWeight: 600,
    },
    h5: {
      color: "#ccd6f6",
    },
    body1: {
      color: "#8892b0",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "transparent",
          boxShadow: "none",
        },
      },
    },
  },
});
