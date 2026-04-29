import {
  Box,
  Typography,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Avatar,
} from "@mui/material";
import { useApp } from "../context/AppContext";
import { t } from "../i18n/translation";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";

export default function Settings() {
  const { lang, setLang, theme, setTheme } = useApp();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        {t[lang].settings}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <LanguageIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t[lang].language}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lang === "en" ? t[lang].english : t[lang].persian}
              </Typography>
            </Box>
          </Box>
          <ToggleButtonGroup
            value={lang}
            exclusive
            onChange={(_, v) => v && setLang(v)}
            fullWidth
            sx={{
              "& .MuiToggleButton-root": {
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
              },
              "& .Mui-selected": {
                bgcolor: "primary.main !important",
                color: "primary.contrastText !important",
              },
            }}
          >
            <ToggleButton value="en">English (EN)</ToggleButton>
            <ToggleButton value="fa">فارسی (FA)</ToggleButton>
          </ToggleButtonGroup>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {theme === "dark" ? <DarkModeIcon /> : <WbSunnyIcon />}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t[lang].theme}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {theme === "dark" ? t[lang].dark : t[lang].light}
              </Typography>
            </Box>
          </Box>
          <ToggleButtonGroup
            value={theme}
            exclusive
            onChange={(_, v) => v && setTheme(v)}
            fullWidth
            sx={{
              "& .MuiToggleButton-root": {
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
              },
              "& .Mui-selected": {
                bgcolor: "secondary.main !important",
                color: "#fff !important",
              },
            }}
          >
            <ToggleButton value="dark" startIcon={<DarkModeIcon />}>
              {t[lang].dark}
            </ToggleButton>
            <ToggleButton value="light" startIcon={<WbSunnyIcon />}>
              {t[lang].light}
            </ToggleButton>
          </ToggleButtonGroup>
        </CardContent>
      </Card>
    </Box>
  );
}
