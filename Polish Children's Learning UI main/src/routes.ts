import { createBrowserRouter } from "react-router";
import SkillsPage from "./pages/SkillsPage";
import SubSkillsPage from "./pages/SubSkillsPage";
import PracticePage from "./pages/PracticePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SkillsPage,
  },
  {
    path: "/skills/:skillId",
    Component: SubSkillsPage,
  },
  {
    path: "/practice/:subSkillId",
    Component: PracticePage,
  },
]);
