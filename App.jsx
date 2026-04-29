import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./app/theme";

const Inner = () => {
  const { theme, lang } = useApp();
  const dir = lang === "fa" ? "rtl" : "ltr";
  document.body.dir = dir;
  document.documentElement.lang = lang;

  return (
    <ThemeProvider theme={getTheme(theme, dir)}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Inner />
      </AuthProvider>
    </AppProvider>
  );
}
