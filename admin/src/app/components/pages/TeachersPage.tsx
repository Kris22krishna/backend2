import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Mail,
  Key,
  Ban,
  Trash2,
  Eye,
  BarChart3,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  classesCount: number;
  studentsCount: number;
  lastActive: string;
  status: "active" | "idle" | "inactive";
  avatar: string;
}

const mockTeachers: Teacher[] = [
  {
    id: "T-2024-101",
    name: "Dr. Emily Parker",
    email: "emily.parker@school.com",
    subject: "Mathematics",
    classesCount: 5,
    studentsCount: 120,
    lastActive: "10 minutes ago",
    status: "active",
    avatar: "EP",
  },
  {
    id: "T-2024-102",
    name: "John Martinez",
    email: "john.martinez@school.com",
    subject: "Science",
    classesCount: 4,
    studentsCount: 95,
    lastActive: "2 days ago",
    status: "idle",
    avatar: "JM",
  },
  {
    id: "T-2024-103",
    name: "Lisa Anderson",
    email: "lisa.anderson@school.com",
    subject: "English",
    classesCount: 6,
    studentsCount: 140,
    lastActive: "5 hours ago",
    status: "active",
    avatar: "LA",
  },
];

export function TeachersPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const getStatusColor = (status: Teacher["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "idle":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  const getStatusIcon = (status: Teacher["status"]) => {
    switch (status) {
      case "active":
        return "🟢";
      case "idle":
        return "🟡";
      case "inactive":
        return "🔴";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
            <p className="text-2xl font-bold text-gray-900">87</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active (Last 7d)</p>
            <p className="text-2xl font-bold text-green-600">72</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Classes</p>
            <p className="text-2xl font-bold text-blue-600">245</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Teacher
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="size-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Classes
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Students
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Last Active
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={(e) => {
                    if (
                      !(e.target as HTMLElement).closest("button") &&
                      !(e.target as HTMLElement).closest('[role="checkbox"]')
                    ) {
                      setSelectedTeacher(teacher);
                    }
                  }}
                >
                  <td className="px-4 py-3">
                    <Checkbox onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {teacher.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {teacher.name}
                        </p>
                        <p className="text-sm text-gray-500">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{teacher.subject}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {teacher.classesCount}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {teacher.studentsCount}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {teacher.lastActive}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={getStatusColor(teacher.status)}
                    >
                      {getStatusIcon(teacher.status)}{" "}
                      {teacher.status.charAt(0).toUpperCase() +
                        teacher.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="size-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="size-4 mr-2" />
                          View Stats
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="size-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Detail Drawer */}
      <Sheet
        open={!!selectedTeacher}
        onOpenChange={() => setSelectedTeacher(null)}
      >
        <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
          {selectedTeacher && (
            <>
              <SheetHeader>
                <SheetTitle>Teacher Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="text-center">
                  <div className="size-20 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                    {selectedTeacher.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedTeacher.name}
                  </h3>
                  <p className="text-gray-600">{selectedTeacher.subject}</p>
                  <p className="text-sm text-gray-500">
                    {selectedTeacher.email}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ID: {selectedTeacher.id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedTeacher.classesCount}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Classes</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedTeacher.studentsCount}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Students</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    View Full Profile
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="size-4 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setSelectedTeacher(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
