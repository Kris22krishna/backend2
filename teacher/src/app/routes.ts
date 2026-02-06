import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Assignments from "./pages/Assignments";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/students",
    Component: Students,
  },
  {
    path: "/assignments",
    Component: Assignments,
  },
  {
    path: "/attendance",
    Component: Attendance,
  },
  {
    path: "/settings",
    Component: Settings,
  },
]);
