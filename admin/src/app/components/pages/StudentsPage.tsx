import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  X,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  lastActive: string;
  status: "active" | "idle" | "inactive" | "suspended";
  avatar: string;
  quizzesCompleted: number;
  avgScore: number;
  timeSpent: string;
}

const mockStudents: Student[] = [
  {
    id: "ST-2024-1892",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    grade: 8,
    lastActive: "2 minutes ago",
    status: "active",
    avatar: "SJ",
    quizzesCompleted: 45,
    avgScore: 72,
    timeSpent: "12.3h",
  },
  {
    id: "ST-2024-1893",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    grade: 10,
    lastActive: "5 days ago",
    status: "idle",
    avatar: "MC",
    quizzesCompleted: 32,
    avgScore: 85,
    timeSpent: "18.7h",
  },
  {
    id: "ST-2024-1894",
    name: "Emma Williams",
    email: "emma.williams@email.com",
    grade: 7,
    lastActive: "32 days ago",
    status: "inactive",
    avatar: "EW",
    quizzesCompleted: 12,
    avgScore: 65,
    timeSpent: "5.2h",
  },
  {
    id: "ST-2024-1895",
    name: "James Rodriguez",
    email: "james.rodriguez@email.com",
    grade: 9,
    lastActive: "1 hour ago",
    status: "active",
    avatar: "JR",
    quizzesCompleted: 58,
    avgScore: 91,
    timeSpent: "24.1h",
  },
  {
    id: "ST-2024-1896",
    name: "Olivia Brown",
    email: "olivia.brown@email.com",
    grade: 11,
    lastActive: "3 days ago",
    status: "active",
    avatar: "OB",
    quizzesCompleted: 67,
    avgScore: 88,
    timeSpent: "31.5h",
  },
];

export function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "idle":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-700 border-red-200";
      case "suspended":
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return "🟢";
      case "idle":
        return "🟡";
      case "inactive":
        return "🔴";
      case "suspended":
        return "⚫";
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === mockStudents.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockStudents.map((s) => s.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">1,240</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active (Last 7d)</p>
            <p className="text-2xl font-bold text-green-600">895</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Inactive</p>
            <p className="text-2xl font-bold text-red-600">345</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Student
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or student ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm font-medium text-blue-900">
            {selectedRows.length} student{selectedRows.length > 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="size-4" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="size-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
              <Ban className="size-4" />
              Suspend
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRows([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selectedRows.length === mockStudents.length}
                    onCheckedChange={toggleAllRows}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
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
              {mockStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={(e) => {
                    if (
                      !(e.target as HTMLElement).closest("button") &&
                      !(e.target as HTMLElement).closest('[role="checkbox"]')
                    ) {
                      setSelectedStudent(student);
                    }
                  }}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedRows.includes(student.id)}
                      onCheckedChange={() => toggleRowSelection(student.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {student.avatar}
                      </div>
                      <span className="font-medium text-gray-900">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{student.grade}</td>
                  <td className="px-4 py-3 text-gray-700">{student.email}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {student.lastActive}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={getStatusColor(student.status)}
                    >
                      {getStatusIcon(student.status)}{" "}
                      {student.status.charAt(0).toUpperCase() +
                        student.status.slice(1)}
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
                        <DropdownMenuItem>
                          <Key className="size-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Ban className="size-4 mr-2" />
                          Suspend Account
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="size-4 mr-2" />
                          Delete Account
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

      {/* Student Detail Drawer */}
      <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
          {selectedStudent && (
            <>
              <SheetHeader>
                <SheetTitle>Student Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Profile Header */}
                <div className="text-center">
                  <div className="size-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                    {selectedStudent.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-gray-600">Grade {selectedStudent.grade}</p>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.email}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ID: {selectedStudent.id}
                  </p>
                </div>

                {/* Status Card */}
                <div
                  className={`rounded-lg p-4 border ${getStatusColor(
                    selectedStudent.status
                  )}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getStatusIcon(selectedStudent.status)}
                    </span>
                    <div>
                      <p className="font-semibold">
                        {selectedStudent.status.charAt(0).toUpperCase() +
                          selectedStudent.status.slice(1)}
                      </p>
                      <p className="text-sm">
                        Last login: {selectedStudent.lastActive}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Performance Stats
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedStudent.quizzesCompleted}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Quizzes Completed
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedStudent.avgScore}%
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Avg Score</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedStudent.timeSpent}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Time Spent</p>
                    </div>
                  </div>
                </div>

                {/* Skills Performance */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Skills Performance
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: "Fractions", score: 45 },
                      { name: "Algebra", score: 68 },
                      { name: "Geometry", score: 72 },
                    ].map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{skill.name}</span>
                          <span className="font-semibold text-gray-900">
                            {skill.score}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${skill.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Recent Activity
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Completed "Algebra Quiz 3" - 78%</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Started practice: Fractions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Joined class: "Math 8A"</span>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Account Info
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Created: Jan 15, 2024</p>
                    <p>Parent: Jane Johnson (linked)</p>
                    <p>Class: Math 8A, Science 8B</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    View Full Profile
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="size-4 mr-2" />
                    Send Message
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Key className="size-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setSelectedStudent(null)}
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
