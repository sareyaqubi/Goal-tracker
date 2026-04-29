import dayjs from "dayjs";

export const calcProgress = (goal) => {
  if (!goal || goal.target <= 0) return 0;
  return Math.min((goal.progress / goal.target) * 100, 100);
};

export const calcLevel = (xp) => Math.floor(xp / 100) + 1;

export const xpForLevel = (level) => (level - 1) * 100;

export const calcGoalStreak = (logs) => {
  if (!logs || logs.length === 0) return 0;

  const sorted = [...logs].sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );

  const today = dayjs().startOf("day");
  const yesterday = dayjs().subtract(1, "day").startOf("day");
  const firstLogDate = dayjs(sorted[0].date).startOf("day");

  if (
    !firstLogDate.isSame(today, "day") &&
    !firstLogDate.isSame(yesterday, "day")
  ) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const currentDate = dayjs(sorted[i - 1].date).startOf("day");
    const prevDate = dayjs(sorted[i].date).startOf("day");
    const diff = currentDate.diff(prevDate, "day");

    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
};

export const calcGlobalStreak = (goals) => {
  if (!goals || goals.length === 0) return 0;

  const allLogs = goals.flatMap((g) =>
    (g.logs || []).map((l) => ({ ...l, goalId: g.id }))
  );

  if (allLogs.length === 0) return 0;

  const activeDates = [...new Set(allLogs.map((l) => l.date))].sort(
    (a, b) => dayjs(b).valueOf() - dayjs(a).valueOf()
  );

  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  if (activeDates[0] !== today && activeDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < activeDates.length; i++) {
    const current = dayjs(activeDates[i - 1]);
    const prev = dayjs(activeDates[i]);
    const diff = current.diff(prev, "day");

    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
};

export const calcXPForLog = (goal, amount = 1) => {
  if (goal.type === "daily") return 10;
  if (goal.type === "count") return 20;
  if (goal.type === "time") return Math.max(1, Math.round(amount / 5));
  return 10;
};

export const formatProgress = (percent) => `${Math.round(percent)}%`;

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dayjs(dateStr).format("MMM D, YYYY");
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return "";
  return dayjs(dateStr).format("MMM D");
};

export const getGoalColor = (color) => {
  const colors = {
    blue: "#00f0ff",
    purple: "#7b2ff7",
    green: "#00ff88",
    orange: "#ffaa00",
    red: "#ff4757",
    pink: "#ff6b9d",
    yellow: "#ffd93d",
    teal: "#00d2d3",
  };
  return colors[color] || colors.blue;
};

export const categories = [
  { value: "health", label: "Health", icon: "🏃" },
  { value: "fitness", label: "Fitness", icon: "💪" },
  { value: "learning", label: "Learning", icon: "📚" },
  { value: "work", label: "Work", icon: "💼" },
  { value: "finance", label: "Finance", icon: "💰" },
  { value: "personal", label: "Personal", icon: "🌟" },
  { value: "social", label: "Social", icon: "👥" },
  { value: "creative", label: "Creative", icon: "🎨" },
];

export const goalTypes = [
  { value: "daily", label: "Daily" },
  { value: "count", label: "Count" },
  { value: "time", label: "Time (minutes)" },
];
