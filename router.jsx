import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Goals from "../pages/Goals";
import NewGoal from "../pages/NewGoal";
import EditGoal from "../pages/EditGoal";
import GoalDetails from "../pages/GoalDetails";
import Categories from "../pages/Categories";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/goals", element: <Goals /> },
          { path: "/goals/new", element: <NewGoal /> },
          { path: "/goals/:id/edit", element: <EditGoal /> },
          { path: "/goals/:id", element: <GoalDetails /> },
          { path: "/categories", element: <Categories /> },
          { path: "/settings", element: <Settings /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
