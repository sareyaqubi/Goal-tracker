import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { calcLevel, calcXPForLog, calcGlobalStreak } from "../utils/helpers";

const Ctx = createContext();

export const AppProvider = ({ children }) => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("gt_goals");
    return saved ? JSON.parse(saved) : [];
  });
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("gt_stats");
    return saved ? JSON.parse(saved) : { xp: 0, level: 1, globalStreak: 0 };
  });
  const [lang, setLang] = useState(() => localStorage.getItem("gt_lang") || "en");
  const [theme, setTheme] = useState(() => localStorage.getItem("gt_theme") || "dark");

  useEffect(() => localStorage.setItem("gt_goals", JSON.stringify(goals)), [goals]);
  useEffect(() => localStorage.setItem("gt_stats", JSON.stringify(stats)), [stats]);
  useEffect(() => localStorage.setItem("gt_lang", lang), [lang]);
  useEffect(() => localStorage.setItem("gt_theme", theme), [theme]);

  const addGoal = useCallback((goalData) => {
    const newGoal = {
      id: uuid(),
      title: goalData.title,
      category: goalData.category,
      type: goalData.type || "count",
      target: Number(goalData.target) || 1,
      progress: 0,
      startDate: goalData.startDate || dayjs().format("YYYY-MM-DD"),
      endDate: goalData.endDate || "",
      notes: goalData.notes || "",
      color: goalData.color || "blue",
      status: "active",
      logs: [],
      createdAt: Date.now(),
    };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal.id;
  }, []);

  const updateGoal = useCallback((id, updates) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addProgress = useCallback((id, amount = 1) => {
    const today = dayjs().format("YYYY-MM-DD");

    setGoals((prev) => {
      const updated = prev.map((g) => {
        if (g.id !== id || g.status !== "active") return g;
        const newProgress = g.progress + amount;
        const isCompleted = newProgress >= g.target;
        return {
          ...g,
          progress: newProgress,
          status: isCompleted ? "completed" : g.status,
          logs: [...g.logs, { date: today, amount, timestamp: Date.now() }],
        };
      });

      const goal = updated.find((g) => g.id === id);
      if (goal) {
        const xpGain = calcXPForLog(goal, amount);
        setStats((s) => {
          const newXp = s.xp + xpGain;
          return { ...s, xp: newXp, level: calcLevel(newXp) };
        });
      }

      return updated;
    });
  }, []);

  const toggleGoal = useCallback((id) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: g.status === "paused" ? "active" : "paused" }
          : g
      )
    );
  }, []);

  const restoreGoal = useCallback((id) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, status: "active", progress: 0, logs: [] } : g
      )
    );
  }, []);

  const archiveGoal = useCallback((id) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: "completed" } : g))
    );
  }, []);

  useEffect(() => {
    const globalStreak = calcGlobalStreak(goals);
    setStats((s) => ({ ...s, globalStreak }));
  }, [goals]);

  return (
    <Ctx.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        addProgress,
        toggleGoal,
        restoreGoal,
        archiveGoal,
        stats,
        lang,
        setLang,
        theme,
        setTheme,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useApp = () => useContext(Ctx);
