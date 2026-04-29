import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  calcProgress,
  calcGoalStreak,
  getGoalColor,
  formatDate,
  categories,
  goalTypes,
  calcXPForLog,
} from "../utils/helpers";
import { t } from "../i18n/translation";
import ConfirmDialog from "../components/ConfirmDialog";
import Snackbar from "../components/Snackbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StarsIcon from "@mui/icons-material/Stars";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import NotesIcon from "@mui/icons-material/Notes";
import dayjs from "dayjs";

export default function GoalDetails() {
  const { id } = useParams();
  const { goals, addProgress, updateGoal, toggleGoal, deleteGoal, restoreGoal, lang } = useApp();
  const navigate = useNavigate();
  const [logAmount, setLogAmount] = useState(1);
  const [showLogInput, setShowLogInput] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const goal = goals.find((g) => g.id === id);

  if (!goal) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Goal not found
        </Typography>
        <Button component={Link} to="/goals">{t[lang].goals}</Button>
      </Box>
    );
  }

  const progress = calcProgress(goal);
  const streak = calcGoalStreak(goal.logs);
  const color = getGoalColor(goal.color);
  const cat = categories.find((c) => c.value === goal.category);
  const typeObj = goalTypes.find((ty) => ty.value === goal.type);

  const handleAddProgress = () => {
    const amount = logAmount || 1;
    addProgress(id, amount);
    setLogAmount(1);
    setShowLogInput(false);
    setSnackbar({ open: true, message: t[lang].progressAdded, severity: "success" });
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteGoal(deleteTarget.id);
      setDeleteTarget(null);
      setSnackbar({ open: true, message: t[lang].goalDeleted, severity: "success" });
      setTimeout(() => navigate("/goals"), 500);
    }
  };

  const handleRestore = () => {
    restoreGoal(id);
    setSnackbar({ open: true, message: t[lang].goalUpdated, severity: "success" });
  };

  const sortedLogs = [...(goal.logs || [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        {t[lang].back}
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {goal.title}
            </Typography>
            <Chip
              label={goal.status}
              size="small"
              sx={{
                bgcolor: `${color}22`,
                color,
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              icon={<CategoryIcon />}
              label={cat ? `${cat.icon} ${t[lang][goal.category]}` : goal.category}
              size="small"
              sx={{ bgcolor: `${color}22`, color, fontWeight: 600 }}
            />
            <Chip
              label={t[lang][goal.type] || goal.type}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {goal.status === "active" && (
            <>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowLogInput(!showLogInput)}
                sx={{
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  "&:hover": { background: `linear-gradient(135deg, ${color}cc, ${color}99)` },
                }}
              >
                {t[lang].addProgress}
              </Button>
              <Button
                variant="outlined"
                startIcon={<PauseIcon />}
                onClick={() => toggleGoal(id)}
                color="warning"
              >
                {t[lang].pause}
              </Button>
            </>
          )}
          {goal.status === "paused" && (
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => toggleGoal(id)}
              sx={{
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              }}
            >
              {t[lang].resume}
            </Button>
          )}
          {goal.status === "completed" && (
            <Button
              variant="outlined"
              startIcon={<FlagIcon />}
              onClick={handleRestore}
              color="success"
            >
              {t[lang].restore}
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            component={Link}
            to={`/goals/${id}/edit`}
          >
            {t[lang].edit}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteTarget(goal)}
            color="error"
          >
            {t[lang].delete}
          </Button>
        </Box>
      </Box>

      {showLogInput && (
        <Card sx={{ mb: 3, border: `1px solid ${color}33` }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {t[lang].addProgress}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap" }}>
              <TextField
                label={t[lang].amount}
                type="number"
                value={logAmount}
                onChange={(e) => setLogAmount(Number(e.target.value))}
                size="small"
                sx={{ width: 120 }}
                InputProps={{ inputProps: { min: 1 } }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained" onClick={handleAddProgress} size="small" sx={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                  {t[lang].add}
                </Button>
                <Button variant="outlined" onClick={() => setShowLogInput(false)} size="small">
                  {t[lang].cancel}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {goal.progress} / {goal.target}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: goal.status === "completed" ? "success.main" : color,
                  }}
                >
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 14,
                  borderRadius: 8,
                  bgcolor: "action.hover",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 8,
                    bgcolor: goal.status === "completed" ? "success.main" : color,
                  },
                }}
              />
              {goal.notes && (
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 2 }}>
                  <NotesIcon color="action" sx={{ mt: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {goal.notes}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {t[lang].logs} ({goal.logs?.length || 0})
              </Typography>
              {sortedLogs.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">{t[lang].noLogs}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {t[lang].noLogsDesc}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {sortedLogs.map((log, idx) => (
                    <Box key={`${log.date}-${log.timestamp || idx}-${idx}`}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: `${color}22`,
                              color,
                              fontWeight: 700,
                            }}
                          >
                            +{log.amount}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`+${log.amount} ${t[lang][goal.type] || ""}`}
                          secondary={formatDate(log.date)}
                          primaryTypographyProps={{ fontWeight: 600 }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          +{calcXPForLog(goal, log.amount)} XP
                        </Typography>
                      </ListItem>
                      {idx < sortedLogs.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                {t[lang].stats}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalFireDepartmentIcon sx={{ color: "warning.main" }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t[lang].streak}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "warning.main" }}>
                    {streak} {t[lang].days}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayIcon color="action" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t[lang].startDate}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {goal.startDate ? formatDate(goal.startDate) : "-"}
                  </Typography>
                </Box>
                {goal.endDate && (
                  <>
                    <Divider />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarTodayIcon color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {t[lang].endDate}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(goal.endDate)}
                      </Typography>
                    </Box>
                  </>
                )}
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StarsIcon sx={{ color: "secondary.main" }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      XP / {t[lang].log.toLowerCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    +{calcXPForLog(goal)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t[lang].confirmDeleteTitle}
        message={t[lang].confirmDelete}
        confirmText={t[lang].delete}
        cancelText={t[lang].cancel}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
}
