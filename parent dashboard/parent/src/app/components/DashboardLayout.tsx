import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Award,
  BarChart3,
  Bell,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: FileText, label: "Quizzes", path: "/quizzes" },
  { icon: Award, label: "Skills", path: "/skills" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Bell, label: "Notifications", path: "/notifications", badge: 3 },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const mockChildren = [
  { id: "1", name: "Emma Johnson", grade: "Grade 5", avatar: null },
  { id: "2", name: "Oliver Johnson", grade: "Grade 3", avatar: null },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
            <h1 className="text-xl font-semibold text-slate-900">
              Parent Portal
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#A8FBD3]/30 text-[#31326F]"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-5 w-5 ${isActive ? "text-[#4FB7B3]" : "text-slate-500"}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs px-1.5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Child selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-48">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedChild.avatar || undefined} />
                      <AvatarFallback className="text-xs bg-[#A8FBD3] text-[#31326F]">
                        {selectedChild.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{selectedChild.name}</div>
                      <div className="text-xs text-slate-500">{selectedChild.grade}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {mockChildren.map((child) => (
                    <DropdownMenuItem
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className="gap-3 py-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={child.avatar || undefined} />
                        <AvatarFallback className="text-xs bg-[#A8FBD3] text-[#31326F]">
                          {child.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{child.name}</div>
                        <div className="text-xs text-slate-500">{child.grade}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        PJ
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">
                      Parent
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6">
          <Outlet context={{ selectedChild }} />
        </main>
      </div>
    </div>
  );
}