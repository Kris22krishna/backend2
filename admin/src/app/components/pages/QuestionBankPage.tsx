import { Search, Plus, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const mockQuestions = [
  {
    id: "QST-1001",
    text: "What is 5 + 7?",
    skill: "Addition",
    grade: 3,
    difficulty: "easy",
    attempts: 1250,
    accuracy: 92,
    reports: 0,
  },
  {
    id: "QST-1002",
    text: "Solve for x: 2x + 5 = 13",
    skill: "Algebra",
    grade: 8,
    difficulty: "medium",
    attempts: 840,
    accuracy: 68,
    reports: 2,
  },
  {
    id: "QST-1003",
    text: "Calculate the area of a circle with radius 7",
    skill: "Geometry",
    grade: 9,
    difficulty: "medium",
    attempts: 567,
    accuracy: 45,
    reports: 5,
  },
];

export function QuestionBankPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Questions</p>
            <p className="text-2xl font-bold text-gray-900">8,542</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">8,415</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Under Review</p>
            <p className="text-2xl font-bold text-yellow-600">127</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Reported Issues</p>
            <p className="text-2xl font-bold text-red-600">45</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Question
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
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
                Question
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Skill
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Grade
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Attempts
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Accuracy
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Reports
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockQuestions.map((question) => (
              <tr
                key={question.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      {question.text}
                    </p>
                    <p className="text-xs text-gray-500">ID: {question.id}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {question.skill}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{question.grade}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      question.difficulty === "easy"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : question.difficulty === "medium"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {question.difficulty}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{question.attempts}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-medium ${
                      question.accuracy >= 70
                        ? "text-green-600"
                        : question.accuracy >= 50
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {question.accuracy}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  {question.reports > 0 ? (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="size-4" />
                      <span className="font-medium">{question.reports}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">0</span>
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
