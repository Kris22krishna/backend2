import { ListChecks, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const mockGeneratedQuestions = [
  {
    id: "GQ-001",
    text: "What is the sum of 15 + 28?",
    skill: "Addition",
    grade: 3,
    generatedAt: "2024-02-04 10:30",
    status: "approved",
  },
  {
    id: "GQ-002",
    text: "Solve for x: 3x - 7 = 14",
    skill: "Algebra",
    grade: 8,
    generatedAt: "2024-02-04 09:45",
    status: "pending",
  },
];

export function GeneratedQuestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Generated</p>
            <p className="text-2xl font-bold text-gray-900">1,248</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">1,127</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">121</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          Export All
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Generated Questions
          </h3>
        </div>
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
                Generated At
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
            {mockGeneratedQuestions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{question.text}</p>
                  <p className="text-xs text-gray-500">ID: {question.id}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {question.skill}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{question.grade}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {question.generatedAt}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      question.status === "approved"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }
                  >
                    {question.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {question.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Approve
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm">
                      View
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
