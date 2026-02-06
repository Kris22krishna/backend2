import { Search, Filter, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const mockUploaders = [
  {
    id: "U-2024-501",
    name: "Admin Content Team",
    email: "content@school.com",
    questionsUploaded: 1250,
    lastUpload: "2 hours ago",
    status: "approved",
  },
  {
    id: "U-2024-502",
    name: "Dr. Sarah Mitchell",
    email: "s.mitchell@school.com",
    questionsUploaded: 340,
    lastUpload: "1 day ago",
    status: "pending",
  },
];

export function UploadersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Uploaders</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Questions Uploaded</p>
            <p className="text-2xl font-bold text-blue-600">8,542</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">127</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Uploader
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search uploaders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="size-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Questions Uploaded
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Last Upload
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockUploaders.map((uploader) => (
              <tr
                key={uploader.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {uploader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="font-medium text-gray-900">
                      {uploader.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{uploader.email}</td>
                <td className="px-4 py-3 text-gray-700">
                  {uploader.questionsUploaded}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {uploader.lastUpload}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      uploader.status === "approved"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : uploader.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {uploader.status === "approved" ? (
                      <CheckCircle className="size-3 mr-1" />
                    ) : uploader.status === "pending" ? (
                      <Clock className="size-3 mr-1" />
                    ) : (
                      <XCircle className="size-3 mr-1" />
                    )}
                    {uploader.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
