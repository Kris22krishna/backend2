import { Search, Filter, Download, Eye, User, FileText, Settings as SettingsIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const mockActivityLog = [
  {
    id: "LOG-001",
    timestamp: "2024-02-04 10:32:15",
    user: "Admin User",
    action: "Created Quiz",
    target: "Algebra Basics Quiz",
    category: "content",
    ip: "192.168.1.1",
  },
  {
    id: "LOG-002",
    timestamp: "2024-02-04 10:28:42",
    user: "Dr. Emily Parker",
    action: "Updated Student Grade",
    target: "Sarah Johnson - Grade 8",
    category: "user",
    ip: "192.168.1.45",
  },
  {
    id: "LOG-003",
    timestamp: "2024-02-04 10:15:23",
    user: "Admin User",
    action: "Changed System Settings",
    target: "Email Notifications",
    category: "system",
    ip: "192.168.1.1",
  },
  {
    id: "LOG-004",
    timestamp: "2024-02-04 09:47:11",
    user: "John Martinez",
    action: "Uploaded Questions",
    target: "15 new questions",
    category: "content",
    ip: "192.168.1.78",
  },
  {
    id: "LOG-005",
    timestamp: "2024-02-04 09:30:05",
    user: "Admin User",
    action: "Suspended User Account",
    target: "test.user@email.com",
    category: "user",
    ip: "192.168.1.1",
  },
];

export function ActivityLogPage() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "user":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "content":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "system":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "user":
        return <User className="size-4" />;
      case "content":
        return <FileText className="size-4" />;
      case "system":
        return <SettingsIcon className="size-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Today's Activities</p>
          <p className="text-2xl font-bold text-gray-900">342</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">User Actions</p>
          <p className="text-2xl font-bold text-blue-600">187</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Content Changes</p>
          <p className="text-2xl font-bold text-purple-600">98</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">System Changes</p>
          <p className="text-2xl font-bold text-orange-600">57</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activity log..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="size-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                User
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Action
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Target
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                IP Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockActivityLog.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {log.timestamp}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-semibold">
                      {log.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {log.user}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {log.action}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{log.target}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={getCategoryColor(log.category)}>
                    <span className="mr-1">{getCategoryIcon(log.category)}</span>
                    {log.category}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{log.ip}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">
                    <Eye className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-4 border border-gray-200">
        <p className="text-sm text-gray-600">Showing 1-5 of 342 activities</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
