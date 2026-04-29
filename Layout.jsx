import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { t } from "../i18n/translation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FlagIcon from "@mui/icons-material/Flag";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const navItems = [
  { labelKey: "dashboard", path: "/", icon: <DashboardIcon /> },
  { labelKey: "goals", path: "/goals", icon: <FlagIcon /> },
  { labelKey: "categories", path: "/categories", icon: <CategoryIcon /> },
  { labelKey: "settings", path: "/settings", icon: <SettingsIcon /> },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { lang } = useApp();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const userName = user?.name || user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const drawerContent = (
    <Box sx={{ width: 260 }} role="presentation">
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
            fontSize: "0.9rem",
          }}
        >
          {initials}
        </Avatar>
        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
          {userName}
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ my: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "primary.contrastText" : "text.primary",
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "primary.contrastText" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={t[lang][item.labelKey] || item.labelKey}
                  primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ my: 0.5 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: 2,
              color: "error.main",
              "&:hover": { bgcolor: "error.main", color: "#fff" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary={t[lang].logout}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                edge="start"
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #00f0ff, #7b2ff7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t[lang].appTitle}
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: isActive ? "primary.main" : "text.secondary",
                      fontWeight: isActive ? 700 : 500,
                      borderBottom: isActive ? "2px solid" : "2px solid transparent",
                      borderColor: "primary.main",
                      borderRadius: 0,
                      py: 1,
                      "&:hover": {
                        color: "primary.main",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    {t[lang][item.labelKey] || item.labelKey}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {!isMobile && (
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {userName}
              </Typography>
            )}
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                width: 36,
                height: 36,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
              onClick={handleLogout}
            >
              {initials}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Box
          component="nav"
          style={{ left: 0, right: 'auto', position: 'fixed' }}
          sx={{
            width: 260,
            flexShrink: 0,
            mt: "64px",
            height: "calc(100vh - 64px)",
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            overflowY: "auto",
          }}
        >
          {drawerContent}
        </Box>
      )}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        style={{ marginLeft: isMobile ? 0 : '260px' }}
        sx={{
          flexGrow: 1,
          mt: "64px",
          p: { xs: 2, sm: 3 },
          minHeight: "calc(100vh - 64px)",
          bgcolor: "background.default",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
