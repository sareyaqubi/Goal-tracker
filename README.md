# Goal Tracker Dashboard


🔗 **[Live Demo](https://your-username.github.io/goal-tracker/)** _(update with your actual link)_

---

## Features Checklist

- [x] **Full CRUD Operations** — Create, Read, Update, Delete goals with validation
- [x] **React Router (Multi-Page)** — 10+ pages with protected auth routes
- [x] **Progress Tracking** — Visual progress bars with auto-completion detection
- [x] **XP + Level System** — Earn XP per log, auto-level up (100 XP per level)
- [x] **Streak System** — Per-goal streaks + global streak based on consecutive daily activity
- [x] **Goal Types** — Daily, Count, and Time-based goals
- [x] **Categories** — 8 categories with stats and bar chart visualization
- [x] **Archive System** — Completed goals archived; can be restored and restarted
- [x] **Authentication** — Login/Signup with localStorage persistence
- [x] **Protected Routes** — Unauthenticated users redirected to login
- [x] **Internationalization (i18n)** — Full English (LTR) + Persian/Farsi (RTL) support
- [x] **Theme Toggle** — Dark/Light mode with neon-inspired design
- [x] **Responsive Design** — Mobile-first, works on all screen sizes
- [x] **Charts** — Dashboard area chart + Categories bar chart (Recharts)
- [x] **Confirm Dialogs** — Delete confirmation to prevent accidents
- [x] **Snackbar Notifications** — Success/error feedback on actions
- [x] **Search & Filter** — Search goals, filter by status, sort by progress/newest/category
- [x] **Empty States** — Friendly messages when no data exists
- [x] **Password Strength Meter** — Visual feedback during signup

---

## Screenshots

### Desktop

| Dashboard | Goals Page | EditGoals |
|-----------|-----------|--------------|
| ![Dashboard](./public/assets/screenshots/desktop-dashboard.png) | ![Goals](./public/assets/screenshots/desktop-goals.png) | ![Details](./public/assets/screenshots/edit-goal.png) |

| New Goal | Categories | Settings |
|----------|-----------|----------|
| ![New Goal](./public/assets/screenshots/desktop-new-goal.png) | ![Categories](./public/assets/screenshots/desktop-categories.png) | ![Settings](./public/assets/screenshots/desktop-settings.png) |

### Mobile

| Dashboard (Mobile) | Goals (Mobile) | Sidebar (Mobile) |
|-------------------|---------------|-----------------|
| ![Mobile Dashboard](./public/assets/screenshots/mobile-dashboard.png) | ![Mobile Goals](./public/assets/screenshots/mobile-goals.png) | ![Mobile Sidebar](./public/assets/screenshots/mobile-sidebar.png) |

> 📸 **To add screenshots:** Run the app, capture screenshots at different screen sizes, and save them in `public/assets/screenshots/` with the filenames above.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| Vite | Build tool & dev server |
| React Router v6 | Multi-page routing with auth guards |
| MUI v5 | Component library & theming |
| Recharts | Data visualization (Area & Bar charts) |
| dayjs | Date manipulation (streak calculation) |
| uuid | Unique ID generation |
| LocalStorage | Client-side data persistence |

---

## How to Rum

### Prerequisites
- Node.js 18+ installed
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/goal-tracker.git
cd goal-tracker

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy on Vercel, Netlify, or GitHub Pages.

### Preview Production Build

```bash
npm run preview
```

---

## RTL / LTR System

### Language Switching

The app supports two languages with full UI direction support:

| Language | Direction | Code |
|----------|-----------|------|
| English | LTR (Left-to-Right) | `en` |
| Persian (Farsi) | RTL (Right-to-Left) | `fa` |

### How It Works

1. **Direction Toggle**: When the user switches language in Settings, the `dir` attribute on `<html>` is set to either `"ltr"` or `"rtl"`
2. **MUI Theme Direction**: The MUI theme receives the `direction` property, which automatically mirrors:
   - Navigation sidebar position (left → right)
   - Text alignment
   - Icon positions relative to text
   - Card borders and visual flow
   - Drawer anchor point
3. **Translation System**: All text is loaded from `src/i18n/translation.js` which contains complete key-value pairs for both languages
4. **Layout Preservation**: The layout does NOT break in RTL because:
   - Flexbox `space-between` works bidirectionally
   - MUI components handle RTL automatically via the theme direction
   - Grid layouts adapt to the current direction
   - Drawer slides from the correct side based on `lang`

### Implementation Details

```jsx
// In App.jsx — direction is computed from lang state
const dir = lang === "fa" ? "rtl" : "ltr";
document.body.dir = dir;

// In theme.js — direction passed to createTheme
createTheme({ direction, ... })

// In Layout.jsx — drawer anchors based on language
<Drawer anchor={lang === "fa" ? "right" : "left"} ...>
```

---

## XP System

### How Points Are Earned

Every time a user logs progress on a goal, they earn XP based on the goal type:

| Goal Type | XP per Log |
|-----------|-----------|
| **Daily** | +10 XP |
| **Count** | +20 XP |
| **Time (minutes)** | +1 XP per 5 minutes logged |

### Level Calculation

```
Level = floor(Total XP / 100) + 1
```

- Level 1: 0-99 XP
- Level 2: 100-199 XP
- Level 3: 200-299 XP
- And so on...

Levels are displayed on the Dashboard and increment automatically when XP thresholds are crossed.

---

## Streak System

### Per-Goal Streak

Tracks consecutive days a **specific goal** has been logged:

1. The system looks at all logs for that goal, sorted by date
2. Starting from the most recent log date, it counts backwards
3. If the gap between consecutive log dates is exactly 1 day, the streak continues
4. If a gap of 2+ days is found, the streak breaks
5. If no activity for 2+ days, streak resets to 0

**Example:**
```
Logs: Apr 28, Apr 29, Apr 30 → Streak: 3 days
Logs: Apr 25, Apr 27, Apr 30 → Streak: 1 day (gap on Apr 26, Apr 28-29)
```

### Global Streak

Tracks consecutive days with **any goal activity**:

1. Collects all log dates across ALL goals
2. Removes duplicates (same day, multiple goals)
3. Sorts dates and counts consecutive days
4. If the most recent activity was today or yesterday, the streak is active
5. If no activity for 2+ days, streak resets to 0

**Rules for Reset:**
- Missing **one day** doesn't break the streak (grace period until end of next day)
- Missing **two consecutive days** resets streak to 0
- Both global and per-goal streaks follow the same reset logic

---

## Project Structure

```
goal-tracker/
├── public/
│   └── assets/
│       └── screenshots/    # Place screenshots here
├── src/
│   ├── main.jsx            # Entry point
│   ├── App.jsx             # Root component with providers
│   ├── app/
│   │   ├── router.jsx      # Route definitions + auth guards
│   │   └── theme.js        # MUI theme (dark/light, RTL/LTR)
│   ├── context/
│   │   ├── AppContext.jsx  # Global state (goals, XP, streaks, settings)
│   │   └── AuthContext.jsx # Auth state (login, signup, logout)
│   ├── components/
│   │   ├── Layout.jsx      # App shell with sidebar + navbar
│   │   ├── GoalCard.jsx    # Reusable goal card component
│   │   ├── ConfirmDialog.jsx # Delete confirmation modal
│   │   ├── ProtectedRoute.jsx # Auth route guard
│   │   └── Snackbar.jsx    # Toast notifications
│   ├── pages/
│   │   ├── Login.jsx       # Authentication: sign in
│   │   ├── Signup.jsx      # Authentication: create account
│   │   ├── Dashboard.jsx   # Overview: stats, charts, recent activity
│   │   ├── Goals.jsx       # Goals list with tabs, search, sort
│   │   ├── NewGoal.jsx     # Create goal with validation
│   │   ├── EditGoal.jsx    # Edit existing goal
│   │   ├── GoalDetails.jsx # Single goal: progress, logs, actions
│   │   ├── Categories.jsx  # Category stats with bar chart
│   │   ├── Settings.jsx    # Language + theme toggles
│   │   └── NotFound.jsx    # 404 page
│   ├── utils/
│   │   └── helpers.js      # Utility functions (progress, streak, XP)
│   └── i18n/
│       └── translation.js  # Translation dictionary (EN/FA)
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

