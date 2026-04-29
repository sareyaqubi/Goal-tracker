import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { t } from "../i18n/translation";

export default function Login() {
  const { login } = useAuth();
  const { lang } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: lang === "fa"
          ? "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)"
          : "linear-gradient(135deg, #0a0a1a 0%, #0a1a2e 50%, #1a0a2e 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.03) 0%, transparent 50%)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(123, 47, 247, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0, 240, 255, 0.1) 0%, transparent 50%)",
        }}
      />

      <Card
        sx={{
          p: { xs: 3, sm: 5 },
          width: "100%",
          maxWidth: 440,
          mx: 2,
          borderRadius: 4,
          position: "relative",
          zIndex: 1,
          bgcolor: "background.paper",
          boxShadow: "0 0 40px rgba(0, 240, 255, 0.1), 0 0 80px rgba(123, 47, 247, 0.05)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #00f0ff, #7b2ff7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            {t[lang].appTitle}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t[lang].login}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {t[lang].invalidCredentials}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t[lang].email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t[lang].password}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !email || !password}
            endIcon={<ArrowForwardIcon />}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              background: "linear-gradient(135deg, #00f0ff, #7b2ff7)",
              "&:hover": {
                background: "linear-gradient(135deg, #00d4e0, #6a25d4)",
              },
            }}
          >
            {t[lang].login}
          </Button>
        </form>

        <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
          {t[lang].dontHaveAccount}{" "}
          <Link
            to="/signup"
            style={{
              color: "#00f0ff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {t[lang].signup}
          </Link>
        </Typography>
      </Card>
    </Box>
  );
}
