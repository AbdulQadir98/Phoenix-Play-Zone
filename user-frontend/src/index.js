import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Define your custom theme here
const theme = createTheme({
  palette: {
    primary: {
      main: "#2c3e50", // Custom primary color
    },
    secondary: {
      main: "#95a5a6", // Custom secondary color
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
