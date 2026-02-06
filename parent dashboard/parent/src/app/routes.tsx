import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { DashboardPage } from "@/app/pages/DashboardPage";
import { ProgressPage } from "@/app/pages/ProgressPage";
import { QuizzesPage } from "@/app/pages/QuizzesPage";
import { SkillsPage } from "@/app/pages/SkillsPage";
import { ReportsPage } from "@/app/pages/ReportsPage";
import { NotificationsPage } from "@/app/pages/NotificationsPage";
import { SettingsPage } from "@/app/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "progress", Component: ProgressPage },
      { path: "quizzes", Component: QuizzesPage },
      { path: "skills", Component: SkillsPage },
      { path: "reports", Component: ReportsPage },
      { path: "notifications", Component: NotificationsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
