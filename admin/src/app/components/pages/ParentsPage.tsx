import { Search, Filter, Download, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const mockParents = [
  {
    id: "P-2024-301",
    name: "Jane Johnson",
    email: "jane.j@email.com",
    children: 2,
    lastActive: "1 hour ago",
    status: "active",
  },
  {
    id: "P-2024-302",
    name: "Robert Chen",
    email: "robert.c@email.com",
    children: 1,
    lastActive: "3 days ago",
    status: "idle",
  },
];

export function ParentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Parents</p>
            <p className="text-2xl font-bold text-gray-900">456</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active (Last 7d)</p>
            <p className="text-2xl font-bold text-green-600">324</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Parent
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search parents..."
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
                Children
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Last Active
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockParents.map((parent) => (
              <tr
                key={parent.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {parent.name}
                </td>
                <td className="px-4 py-3 text-gray-700">{parent.email}</td>
                <td className="px-4 py-3 text-gray-700">{parent.children}</td>
                <td className="px-4 py-3 text-gray-700">{parent.lastActive}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      parent.status === "active"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }
                  >
                    🟢 {parent.status}
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
