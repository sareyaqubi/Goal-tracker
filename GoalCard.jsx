import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { calcProgress, calcGoalStreak, getGoalColor, categories, goalTypes } from "../utils/helpers";
import { t } from "../i18n/translation";
import FlagIcon from "@mui/icons-material/Flag";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

export default function GoalCard({ goal, onDelete, onToggle, onAddProgress }) {
  const { lang, theme } = useApp();
  const progress = calcProgress(goal);
  const streak = calcGoalStreak(goal.logs);
  const color = getGoalColor(goal.color);
  const cat = categories.find((c) => c.value === goal.category);
  const typeLabel = t[lang][goal.type] || goal.type;

  const statusConfig = {
    active: { color: "success.main", icon: <PlayArrowIcon />, label: t[lang].active },
    completed: { color: "primary.main", icon: <CheckCircleIcon />, label: t[lang].completed },
    paused: { color: "warning.main", icon: <PauseIcon />, label: t[lang].paused },
  };

  const status = statusConfig[goal.status];

  return (
    <Card
      sx={{
        borderLeft: goal.status === "active" ? `4px solid ${color}` : "4px solid transparent",
        position: "relative",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme === "dark"
            ? `0 8px 32px ${color}33`
            : "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component={Link}
              to={`/goals/${goal.id}`}
              sx={{
                color: "text.primary",
                textDecoration: "none",
                fontWeight: 700,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                "&:hover": { color: "primary.main" },
              }}
            >
              {goal.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
              <Chip
                label={cat ? `${cat.icon} ${t[lang][goal.category]}` : goal.category}
                size="small"
                sx={{
                  bgcolor: `${color}22`,
                  color: color,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
              <Chip
                label={typeLabel}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem", fontWeight: 500 }}
              />
            </Box>
          </Box>
          <Chip
            icon={status.icon}
            label={status.label}
            size="small"
            sx={{
              bgcolor: `${status.color}22`,
              color: status.color,
              fontWeight: 700,
              flexShrink: 0,
            }}
          />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {goal.progress} / {goal.target}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: goal.status === "completed" ? "success.main" : "text.primary" }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              bgcolor: "action.hover",
              "& .MuiLinearProgress-bar": {
                borderRadius: 8,
                bgcolor: goal.status === "completed" ? "success.main" : color,
                transition: "width 0.5s ease",
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {streak > 0 && (
              <>
                <LocalFireDepartmentIcon
                  sx={{ fontSize: 18, color: "warning.main" }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {streak} {t[lang].days}
                </Typography>
              </>
            )}
          </Box>

          <Box>
            {goal.status === "active" && (
              <Tooltip title={t[lang].addProgress}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAddProgress(goal.id);
                  }}
                  sx={{ color: "success.main", "&:hover": { bgcolor: "success.main", color: "#fff" } }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {goal.status !== "completed" && (
              <>
                <Tooltip title={t[lang].edit}>
                  <IconButton
                    size="small"
                    component={Link}
                    to={`/goals/${goal.id}/edit`}
                    sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t[lang].pause}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggle(goal.id);
                    }}
                    sx={{ color: "warning.main", "&:hover": { bgcolor: "warning.main", color: "#fff" } }}
                  >
                    <PauseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {goal.status === "completed" && (
              <Tooltip title={t[lang].restore}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggle(goal.id);
                  }}
                  sx={{ color: "success.main", "&:hover": { bgcolor: "success.main", color: "#fff" } }}
                >
                  <FlagIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t[lang].delete}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(goal);
                }}
                sx={{ color: "error.main", "&:hover": { bgcolor: "error.main", color: "#fff" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
