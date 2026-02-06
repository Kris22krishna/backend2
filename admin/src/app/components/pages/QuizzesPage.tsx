import { Search, Plus, Eye, Edit, Copy, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const mockQuizzes = [
  {
    id: "Q-001",
    title: "Algebra Basics Quiz",
    grade: 8,
    questions: 15,
    attempts: 342,
    avgScore: 78,
    status: "published",
    created: "2024-01-15",
  },
  {
    id: "Q-002",
    title: "Geometry Fundamentals",
    grade: 9,
    questions: 20,
    attempts: 256,
    avgScore: 72,
    status: "published",
    created: "2024-01-18",
  },
  {
    id: "Q-003",
    title: "Fractions Practice",
    grade: 7,
    questions: 12,
    attempts: 0,
    avgScore: 0,
    status: "draft",
    created: "2024-02-01",
  },
];

export function QuizzesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Quizzes</p>
            <p className="text-2xl font-bold text-gray-900">287</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Published</p>
            <p className="text-2xl font-bold text-green-600">245</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Drafts</p>
            <p className="text-2xl font-bold text-yellow-600">42</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
            <p className="text-2xl font-bold text-blue-600">12,453</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Create Quiz
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Quiz Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Grade
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Questions
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Attempts
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Avg Score
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
            {mockQuizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{quiz.title}</p>
                    <p className="text-xs text-gray-500">ID: {quiz.id}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{quiz.grade}</td>
                <td className="px-4 py-3 text-gray-700">{quiz.questions}</td>
                <td className="px-4 py-3 text-gray-700">{quiz.attempts}</td>
                <td className="px-4 py-3">
                  {quiz.avgScore > 0 ? (
                    <span className="font-medium text-gray-900">
                      {quiz.avgScore}%
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      quiz.status === "published"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }
                  >
                    {quiz.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="size-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="size-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="size-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="size-4 mr-2" />
                        Delete
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
  );
}
