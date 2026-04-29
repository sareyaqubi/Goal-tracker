import { useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
} from "@mui/material";
import { useApp } from "../context/AppContext";
import { calcProgress, categories, getGoalColor } from "../utils/helpers";
import { t } from "../i18n/translation";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

export default function Categories() {
  const { goals, lang } = useApp();

  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const catGoals = goals.filter((g) => g.category === cat.value);
      const active = catGoals.filter((g) => g.status === "active").length;
      const completed = catGoals.filter((g) => g.status === "completed").length;
      const paused = catGoals.filter((g) => g.status === "paused").length;
      const avgProgress =
        catGoals.length > 0
          ? catGoals.reduce((sum, g) => sum + calcProgress(g), 0) / catGoals.length
          : 0;

      return {
        ...cat,
        total: catGoals.length,
        active,
        completed,
        paused,
        avgProgress,
      };
    }).filter((c) => c.total > 0);
  }, [goals]);

  const chartData = categoryStats.map((c) => ({
    name: t[lang][c.value] || c.label,
    active: c.active,
    completed: c.completed,
    paused: c.paused,
  }));

  const barColors = {
    active: "#00ff88",
    completed: "#00f0ff",
    paused: "#ffaa00",
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        {t[lang].categories}
      </Typography>

      {categoryStats.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {t[lang].noGoals}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t[lang].noGoalsDesc}
          </Typography>
        </Box>
      ) : (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                {t[lang].statsPerCategory}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      background: "#1a1a2e",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="active" name={t[lang].active} radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={`active-${i}`} fill={barColors.active} />
                    ))}
                  </Bar>
                  <Bar dataKey="completed" name={t[lang].completed} radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={`completed-${i}`} fill={barColors.completed} />
                    ))}
                  </Bar>
                  <Bar dataKey="paused" name={t[lang].paused} radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={`paused-${i}`} fill={barColors.paused} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {categoryStats.map((cat) => {
              const color = getGoalColor(cat.value === "health" ? "green" : cat.value === "fitness" ? "blue" : "purple");
              return (
                <Grid item xs={12} sm={6} md={4} key={cat.value}>
                  <Card
                    sx={{
                      borderLeft: `4px solid ${color}`,
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${color}22`,
                            color,
                            width: 48,
                            height: 48,
                            fontSize: "1.5rem",
                          }}
                        >
                          {cat.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {t[lang][cat.value] || cat.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {cat.total} {t[lang].goals.toLowerCase()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {t[lang].progress}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {Math.round(cat.avgProgress)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={cat.avgProgress}
                          sx={{
                            bgcolor: "action.hover",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 8,
                              bgcolor: color,
                            },
                          }}
                        />
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          icon={<FlagIcon />}
                          label={`${cat.active} ${t[lang].active.toLowerCase()}`}
                          size="small"
                          sx={{ bgcolor: "success.main", color: "#000", fontWeight: 600 }}
                        />
                        <Chip
                          icon={<CheckCircleIcon />}
                          label={`${cat.completed} ${t[lang].completed.toLowerCase()}`}
                          size="small"
                          sx={{ bgcolor: "primary.main", color: "#000", fontWeight: 600 }}
                        />
                        {cat.paused > 0 && (
                          <Chip
                            icon={<PauseCircleIcon />}
                            label={`${cat.paused} ${t[lang].paused.toLowerCase()}`}
                            size="small"
                            sx={{ bgcolor: "warning.main", color: "#000", fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Box>
  );
}
