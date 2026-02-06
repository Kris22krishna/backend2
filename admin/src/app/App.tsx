import { useState } from "react";
import { DashboardOverview } from "./components/DashboardOverview";
import { StudentsPage } from "./components/pages/StudentsPage";
import { TeachersPage } from "./components/pages/TeachersPage";
import { ParentsPage } from "./components/pages/ParentsPage";
import { GuestsPage } from "./components/pages/GuestsPage";
import { UploadersPage } from "./components/pages/UploadersPage";
import { ClassesPage } from "./components/pages/ClassesPage";
import { QuizzesPage } from "./components/pages/QuizzesPage";
import { QuestionBankPage } from "./components/pages/QuestionBankPage";
import { SkillsPage } from "./components/pages/SkillsPage";
import { QuestionGenerationPage } from "./components/pages/QuestionGenerationPage";
import { TemplatesPage } from "./components/pages/TemplatesPage";
import { ArrangementPage } from "./components/pages/ArrangementPage";
import { GeneratedQuestionsPage } from "./components/pages/GeneratedQuestionsPage";
import { AlertsPage } from "./components/pages/AlertsPage";
import { AnalyticsPage } from "./components/pages/AnalyticsPage";
import { ReportsPage } from "./components/pages/ReportsPage";
import { SystemHealthPage } from "./components/pages/SystemHealthPage";
import { ActivityLogPage } from "./components/pages/ActivityLogPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCircle,
  Eye,
  Upload,
  School,
  FileText,
  HelpCircle,
  Brain,
  FileQuestion,
  Grid3x3,
  ListChecks,
  AlertTriangle,
  BarChart3,
  FileBarChart,
  Activity,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Overview");

  const menuItems = [
    {
      section: null,
      items: [
        { name: "Overview", icon: <LayoutDashboard className="size-5" />, page: "overview" },
      ]
    },
    {
      section: "USER MANAGEMENT",
      items: [
        { name: "Students", icon: <GraduationCap className="size-5" />, page: "students" },
        { name: "Teachers", icon: <UserCircle className="size-5" />, page: "teachers" },
        { name: "Parents", icon: <Users className="size-5" />, page: "parents" },
        { name: "Guests", icon: <Eye className="size-5" />, page: "guests" },
        { name: "Uploaders", icon: <Upload className="size-5" />, page: "uploaders" },
        { name: "Classes", icon: <School className="size-5" />, page: "classes" },
      ]
    },
    {
      section: "CONTENT",
      items: [
        { name: "Quizzes", icon: <FileText className="size-5" />, page: "quizzes" },
        { name: "Question Bank", icon: <HelpCircle className="size-5" />, page: "question-bank" },
        { name: "Skills", icon: <Brain className="size-5" />, page: "skills" },
      ]
    },
    {
      section: "QUESTION TOOLS",
      items: [
        { name: "Question Generation", icon: <FileQuestion className="size-5" />, page: "question-generation" },
        { name: "Templates", icon: <FileText className="size-5" />, page: "templates" },
        { name: "Arrangement", icon: <Grid3x3 className="size-5" />, page: "arrangement" },
        { name: "Generated Questions", icon: <ListChecks className="size-5" />, page: "generated-questions" },
      ]
    },
    {
      section: "MONITORING",
      items: [
        { name: "Alerts", icon: <AlertTriangle className="size-5" />, page: "alerts" },
        { name: "Analytics", icon: <BarChart3 className="size-5" />, page: "analytics" },
        { name: "Reports", icon: <FileBarChart className="size-5" />, page: "reports" },
        { name: "System Health", icon: <Activity className="size-5" />, page: "system-health" },
        { name: "Activity Log", icon: <ScrollText className="size-5" />, page: "activity-log" },
      ]
    },
    {
      section: "CONFIGURATION",
      items: [
        { name: "Settings", icon: <Settings className="size-5" />, page: "settings" },
      ]
    }
  ];

  const renderPage = () => {
    switch (activeMenu) {
      case "Overview":
        return <DashboardOverview />;
      case "Students":
        return <StudentsPage />;
      case "Teachers":
        return <TeachersPage />;
      case "Parents":
        return <ParentsPage />;
      case "Guests":
        return <GuestsPage />;
      case "Uploaders":
        return <UploadersPage />;
      case "Classes":
        return <ClassesPage />;
      case "Quizzes":
        return <QuizzesPage />;
      case "Question Bank":
        return <QuestionBankPage />;
      case "Skills":
        return <SkillsPage />;
      case "Question Generation":
        return <QuestionGenerationPage />;
      case "Templates":
        return <TemplatesPage />;
      case "Arrangement":
        return <ArrangementPage />;
      case "Generated Questions":
        return <GeneratedQuestionsPage />;
      case "Alerts":
        return <AlertsPage />;
      case "Analytics":
        return <AnalyticsPage />;
      case "Reports":
        return <ReportsPage />;
      case "System Health":
        return <SystemHealthPage />;
      case "Activity Log":
        return <ActivityLogPage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {/* Section Label */}
              {section.section && (
                <div className="px-3 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.section}
                  </h3>
                </div>
              )}
              
              {/* Menu Items */}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveMenu(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      activeMenu === item.name
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => console.log("Logout clicked")}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="size-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <h2 className="text-xl font-semibold text-gray-900">{activeMenu}</h2>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@platform.com</p>
            </div>
            <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}