import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "../ui/badge";

const mockGuestStats = [
  { metric: "Unique Visitors Today", value: "1,245", change: "+12%", trend: "up" },
  { metric: "Quiz Attempts (Guest)", value: "3,892", change: "+8%", trend: "up" },
  { metric: "Avg. Session Duration", value: "4.5 min", change: "-2%", trend: "down" },
  { metric: "Conversion to Signup", value: "2.3%", change: "+0.5%", trend: "up" },
];

export function GuestsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockGuestStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-2">{stat.metric}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <Badge
                variant="outline"
                className={
                  stat.trend === "up"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="size-3 mr-1" />
                ) : (
                  <TrendingDown className="size-3 mr-1" />
                )}
                {stat.change}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Guest Activity Over Time
          </h3>
          <BarChart3 className="size-5 text-gray-400" />
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chart visualization would appear here</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Quizzes (Guest Access)
        </h3>
        <div className="space-y-3">
          {[
            { name: "Basic Math Skills Quiz", attempts: 892 },
            { name: "English Grammar Basics", attempts: 745 },
            { name: "Science Fundamentals", attempts: 623 },
          ].map((quiz, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-900">{quiz.name}</span>
              <Badge variant="outline">{quiz.attempts} attempts</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
