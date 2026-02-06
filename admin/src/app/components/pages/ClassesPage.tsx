import { Search, Plus, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const mockClasses = [
  {
    id: "CLS-001",
    name: "Math 8A",
    teacher: "Dr. Emily Parker",
    students: 28,
    subject: "Mathematics",
    schedule: "Mon, Wed, Fri 9:00 AM",
  },
  {
    id: "CLS-002",
    name: "Science 10B",
    teacher: "John Martinez",
    students: 24,
    subject: "Science",
    schedule: "Tue, Thu 10:30 AM",
  },
  {
    id: "CLS-003",
    name: "English 9C",
    teacher: "Lisa Anderson",
    students: 26,
    subject: "English",
    schedule: "Mon, Wed 2:00 PM",
  },
];

export function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Classes</p>
            <p className="text-2xl font-bold text-gray-900">45</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active This Week</p>
            <p className="text-2xl font-bold text-green-600">42</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-blue-600">1,156</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Create Class
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {cls.name}
                </h3>
                <p className="text-sm text-gray-600">{cls.teacher}</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {cls.subject}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="size-4" />
                <span>{cls.students} students</span>
              </div>
              <p className="text-sm text-gray-600">{cls.schedule}</p>
            </div>

            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
