import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  calcProgress,
  calcGoalStreak,
  calcGlobalStreak,
  getGoalColor,
  formatDateShort,
  categories,
} from "../utils/helpers";
import { t } from "../i18n/translation";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarsIcon from "@mui/icons-material/Stars";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import dayjs from "dayjs";

const StatCard = ({ icon, label, value, subtext, color, gradient }) => (
  <Card
    sx={{
      background: gradient || "linear-gradient(135deg, rgba(0,240,255,0.1) 0%, rgba(123,47,247,0.1) 100%)",
      border: `1px solid ${color}33`,
      position: "relative",
      overflow: "hidden",
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
      },
    }}
  >
    <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Avatar sx={{ bgcolor: `${color}22`, color, width: 44, height: 44 }}>
          {icon}
        </Avatar>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 800, color, mb: 0.5 }}>
        {value}
      </Typography>
      {subtext && (
        <Typography variant="caption" color="text.secondary">
          {subtext}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { goals, stats, lang } = useApp();
  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  const totalProgress =
    goals.length > 0
      ? goals.reduce((sum, g) => sum + calcProgress(g), 0) / goals.length
      : 0;

  const globalStreak = calcGlobalStreak(goals);

  const chartData = [...Array(7)].map((_, i) => {
    const date = dayjs().subtract(6 - i, "day");
    const dateStr = date.format("YYYY-MM-DD");
    const dayLogs = goals.flatMap((g) =>
      (g.logs || [])
        .filter((l) => l.date === dateStr)
        .map((l) => l.amount)
    );
    const total = dayLogs.reduce((sum, a) => sum + a, 0);
    return {
      name: date.format("ddd"),
      progress: total,
      fullDate: date.format("MMM D"),
    };
  });

  const recentLogs = goals
    .flatMap((g) =>
      (g.logs || []).map((l) => ({
        ...l,
        goalTitle: g.title,
        goalId: g.id,
        goalColor: g.color,
      }))
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            {t[lang].dashboard}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dayjs().format("dddd, MMMM D, YYYY")}
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/goals/new"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(135deg, #00f0ff, #7b2ff7)",
            "&:hover": { background: "linear-gradient(135deg, #00d4e0, #6a25d4)" },
          }}
        >
          {t[lang].newGoal}
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon />}
            label={t[lang].totalCompletion}
            value={`${Math.round(totalProgress)}%`}
            subtext={`${goals.length} ${t[lang].goals.toLowerCase()}`}
            color="#00f0ff"
            gradient="linear-gradient(135deg, rgba(0,240,255,0.08) 0%, rgba(0,240,255,0.02) 100%)"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<StarsIcon />}
            label={t[lang].xpPoints}
            value={stats.xp.toLocaleString()}
            subtext={`${t[lang].level} ${stats.level}`}
            color="#7b2ff7"
            gradient="linear-gradient(135deg, rgba(123,47,247,0.08) 0%, rgba(123,47,247,0.02) 100%)"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<LocalFireDepartmentIcon />}
            label={t[lang].globalStreak}
            value={`${globalStreak}`}
            subtext={t[lang].days}
            color="#ffaa00"
            gradient="linear-gradient(135deg, rgba(255,170,0,0.08) 0%, rgba(255,170,0,0.02) 100%)"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<EmojiEventsIcon />}
            label={t[lang].completedGoals}
            value={completedGoals.length}
            subtext={`${activeGoals.length} ${t[lang].active.toLowerCase()}`}
            color="#00ff88"
            gradient="linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,255,136,0.02) 100%)"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                {t[lang].progress} {t[lang].overview.toLowerCase()}
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      background: "#1a1a2e",
                    }}
                    formatter={(value) => [value, t[lang].progress]}
                    labelFormatter={(label) => {
                      const item = chartData.find((d) => d.name === label);
                      return item?.fullDate || label;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="progress"
                    stroke="#00f0ff"
                    strokeWidth={3}
                    fill="url(#colorProgress)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                {t[lang].activeGoals}
              </Typography>
              {activeGoals.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary" gutterBottom>
                    {t[lang].noGoals}
                  </Typography>
                  <Button
                    component={Link}
                    to="/goals/new"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ mt: 1 }}
                  >
                    {t[lang].newGoal}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {activeGoals.slice(0, 5).map((goal) => {
                    const progress = calcProgress(goal);
                    const color = getGoalColor(goal.color);
                    return (
                      <Box key={goal.id}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {goal.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
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
                              bgcolor: color,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                  {activeGoals.length > 5 && (
                    <Button
                      component={Link}
                      to="/goals"
                      size="small"
                      endIcon={<ArrowUpwardIcon />}
                      sx={{ alignSelf: "center" }}
                    >
                      {t[lang].goals}
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                {t[lang].quickActions}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Button
                  component={Link}
                  to="/goals/new"
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  sx={{
                    justifyContent: "flex-start",
                    background: "linear-gradient(135deg, #00f0ff, #7b2ff7)",
                    py: 1.5,
                  }}
                >
                  {t[lang].newGoal}
                </Button>
                <Button
                  component={Link}
                  to="/goals"
                  variant="outlined"
                  fullWidth
                  startIcon={<EmojiEventsIcon />}
                  sx={{ justifyContent: "flex-start", py: 1.5 }}
                >
                  {t[lang].goals}
                </Button>
                <Button
                  component={Link}
                  to="/categories"
                  variant="outlined"
                  fullWidth
                  startIcon={<TrendingUpIcon />}
                  sx={{ justifyContent: "flex-start", py: 1.5 }}
                >
                  {t[lang].categories}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                {t[lang].recentActivity}
              </Typography>
              {recentLogs.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                  {t[lang].noLogs}
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {recentLogs.map((log, idx) => (
                    <Box key={`${log.goalId}-${log.timestamp}-${idx}`}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: `${getGoalColor(log.goalColor)}22`,
                              color: getGoalColor(log.goalColor),
                              fontSize: "0.8rem",
                            }}
                          >
                            +{log.amount}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={log.goalTitle}
                          secondary={formatDateShort(log.date)}
                          primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItem>
                      {idx < recentLogs.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
