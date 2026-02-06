import { useNavigate, useLocation } from "react-router";
import { GraduationCap, LayoutDashboard, Users, FileText, CalendarCheck, Settings } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: FileText, label: "Assignments", path: "/assignments" },
    { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-4">
      <div className="flex items-center gap-3 mb-8 p-3">
        <div className="bg-white text-blue-700 p-2 rounded-lg">
          <GraduationCap className="size-6" />
        </div>
        <h1 className="text-xl">SKILL100.AI</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              isActive(item.path)
                ? "bg-blue-800 font-medium"
                : "text-blue-100 hover:bg-blue-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
