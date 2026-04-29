import { Snackbar as MuiSnackbar, Alert, AlertTitle } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";

const iconMap = {
  success: <CheckCircleIcon />,
  error: <ErrorIcon />,
  info: <InfoIcon />,
  warning: <WarningIcon />,
};

export default function Snackbar({ open, message, severity = "success", onClose, duration = 3000 }) {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        icon={iconMap[severity]}
        sx={{
          width: "100%",
          borderRadius: 2,
          boxShadow: 3,
          fontWeight: 500,
        }}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
}
