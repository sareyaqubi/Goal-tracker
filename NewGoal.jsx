import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
} from "@mui/material";
import { useApp } from "../context/AppContext";
import { categories, goalTypes } from "../utils/helpers";
import { t } from "../i18n/translation";
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import Snackbar from "../components/Snackbar";

export default function NewGoal() {
  const { addGoal, lang } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "count",
    target: "",
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: "",
    notes: "",
    color: "blue",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const colors = [
    { value: "blue", label: "#00f0ff" },
    { value: "purple", label: "#7b2ff7" },
    { value: "green", label: "#00ff88" },
    { value: "orange", label: "#ffaa00" },
    { value: "red", label: "#ff4757" },
    { value: "pink", label: "#ff6b9d" },
    { value: "yellow", label: "#ffd93d" },
    { value: "teal", label: "#00d2d3" },
  ];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = t[lang].required;
    if (!form.category) newErrors.category = t[lang].required;
    if (!form.target || Number(form.target) <= 0) newErrors.target = t[lang].required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const id = addGoal({
      ...form,
      target: Number(form.target),
    });
    setSnackbar({ open: true, message: t[lang].goalCreated, severity: "success" });
    setTimeout(() => navigate(`/goals/${id}`), 500);
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        {t[lang].back}
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        {t[lang].newGoal}
      </Typography>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t[lang].title}
                  value={form.title}
                  onChange={handleChange("title")}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>{t[lang].category}</InputLabel>
                  <Select
                    value={form.category}
                    label={t[lang].category}
                    onChange={handleChange("category")}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.icon} {t[lang][cat.value] || cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t[lang].type}</InputLabel>
                  <Select
                    value={form.type}
                    label={t[lang].type}
                    onChange={handleChange("type")}
                  >
                    {goalTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {t[lang][type.value] || type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t[lang].target}
                  type="number"
                  value={form.target}
                  onChange={handleChange("target")}
                  error={!!errors.target}
                  helperText={errors.target}
                  required
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t[lang].startDate}
                  type="date"
                  value={form.startDate}
                  onChange={handleChange("startDate")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t[lang].endDate}
                  type="date"
                  value={form.endDate}
                  onChange={handleChange("endDate")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t[lang].notes}
                  value={form.notes}
                  onChange={handleChange("notes")}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {t[lang].color}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {colors.map((c) => (
                    <Chip
                      key={c.value}
                      label=""
                      onClick={() => setForm((prev) => ({ ...prev, color: c.value }))}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: c.label,
                        border: form.color === c.value ? "3px solid #fff" : "3px solid transparent",
                        boxShadow: form.color === c.value ? `0 0 12px ${c.label}88` : "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                      icon={
                        form.color === c.value ? (
                          <CheckIcon sx={{ color: "#fff", fontSize: 20 }} />
                        ) : undefined
                      }
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ minWidth: 120 }}
                  >
                    {t[lang].cancel}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!form.title || !form.category || !form.target}
                    sx={{
                      minWidth: 160,
                      background: "linear-gradient(135deg, #00f0ff, #7b2ff7)",
                      "&:hover": { background: "linear-gradient(135deg, #00d4e0, #6a25d4)" },
                    }}
                  >
                    {t[lang].createGoal}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
}
