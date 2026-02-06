import { Download, FileText, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const mockReports = [
  {
    id: "RPT-001",
    name: "Monthly User Activity Report",
    type: "User Activity",
    dateRange: "Jan 1 - Jan 31, 2024",
    status: "ready",
    generatedAt: "2024-02-01",
  },
  {
    id: "RPT-002",
    name: "Skill Performance Analysis",
    type: "Performance",
    dateRange: "Last 30 days",
    status: "ready",
    generatedAt: "2024-02-03",
  },
  {
    id: "RPT-003",
    name: "Quiz Completion Report",
    type: "Quizzes",
    dateRange: "Last week",
    status: "generating",
    generatedAt: null,
  },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <FileText className="size-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">User Reports</h3>
          <p className="text-sm text-gray-600 mb-4">
            Activity, engagement, and growth metrics
          </p>
          <Button variant="outline" className="w-full">
            Generate Report
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <FileText className="size-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">
            Performance Reports
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Skill accuracy, quiz scores, and trends
          </p>
          <Button variant="outline" className="w-full">
            Generate Report
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <FileText className="size-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Custom Reports</h3>
          <p className="text-sm text-gray-600 mb-4">
            Build custom reports with specific filters
          </p>
          <Button variant="outline" className="w-full">
            Create Custom
          </Button>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Scheduled Reports
          </h3>
          <Button variant="outline" size="sm">
            <Calendar className="size-4 mr-2" />
            Manage Schedule
          </Button>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span>Weekly Activity Summary - Every Monday 9:00 AM</span>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              Active
            </Badge>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span>Monthly Performance Report - 1st of each month</span>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Reports
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Report Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Date Range
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
            {mockReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{report.name}</p>
                  {report.generatedAt && (
                    <p className="text-xs text-gray-500">
                      Generated: {report.generatedAt}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {report.type}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{report.dateRange}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      report.status === "ready"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }
                  >
                    {report.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {report.status === "ready" ? (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="size-4" />
                      Download
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Generating...
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
