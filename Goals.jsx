import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import GoalCard from "../components/GoalCard";
import ConfirmDialog from "../components/ConfirmDialog";
import Snackbar from "../components/Snackbar";
import { calcGoalStreak, categories, goalTypes } from "../utils/helpers";
import { t } from "../i18n/translation";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";

export default function Goals() {
  const { goals, deleteGoal, toggleGoal, addProgress, lang } = useApp();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const tabs = [
    { label: t[lang].all, filter: () => true },
    { label: t[lang].active, filter: (g) => g.status === "active" },
    { label: t[lang].completed, filter: (g) => g.status === "completed" },
    { label: t[lang].paused, filter: (g) => g.status === "paused" },
  ];

  const filtered = useMemo(() => {
    let result = goals.filter(tabs[tab].filter);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          (g.notes && g.notes.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "progress":
        result.sort((a, b) => {
          const pa = a.target > 0 ? (a.progress / a.target) * 100 : 0;
          const pb = b.target > 0 ? (b.progress / b.target) * 100 : 0;
          return pb - pa;
        });
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "newest":
      default:
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return result;
  }, [goals, tab, search, sortBy]);

  const handleDelete = () => {
    if (deleteTarget) {
      deleteGoal(deleteTarget.id);
      setDeleteTarget(null);
      setSnackbar({ open: true, message: t[lang].goalDeleted, severity: "success" });
    }
  };

  const handleAddProgress = (id) => {
    addProgress(id);
    setSnackbar({ open: true, message: t[lang].progressAdded, severity: "success" });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {t[lang].goals}
        </Typography>
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

      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        <TextField
          placeholder={t[lang].search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flex: { xs: 1, sm: "unset" }, minWidth: { sm: 200 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{t[lang].sortBy}</InputLabel>
          <Select
            value={sortBy}
            label={t[lang].sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            startAdornment={
              <InputAdornment position="start" sx={{ ml: 0.5 }}>
                <SortIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="newest">{t[lang].newest}</MenuItem>
            <MenuItem value="progress">{t[lang].progress}</MenuItem>
            <MenuItem value="category">{t[lang].category}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((t, i) => (
          <Tab key={i} label={t.label} />
        ))}
      </Tabs>

      {filtered.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {t[lang].noGoals}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t[lang].noGoalsDesc}
          </Typography>
          <Button
            component={Link}
            to="/goals/new"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #00f0ff, #7b2ff7)",
            }}
          >
            {t[lang].newGoal}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((goal) => (
            <Grid item xs={12} sm={6} lg={4} key={goal.id}>
              <GoalCard
                goal={goal}
                onDelete={setDeleteTarget}
                onToggle={toggleGoal}
                onAddProgress={handleAddProgress}
              />
            </Grid>
          ))}
        </Grid>
      )}

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
