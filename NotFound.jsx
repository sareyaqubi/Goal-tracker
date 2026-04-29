import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { t } from "../i18n/translation";
import HomeIcon from "@mui/icons-material/Home";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFound() {
  const { lang } = useApp();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          mx: 2,
          textAlign: "center",
          p: 2,
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ py: 6 }}>
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: "error.main",
              mb: 2,
            }}
          />
          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: "5rem", lineHeight: 1 }}>
            404
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {t[lang].notFound}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t[lang].notFoundDesc}
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            sx={{
              background: "linear-gradient(135deg, #00f0ff, #7b2ff7)",
              "&:hover": { background: "linear-gradient(135deg, #00d4e0, #6a25d4)" },
            }}
          >
            {t[lang].goHome}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
