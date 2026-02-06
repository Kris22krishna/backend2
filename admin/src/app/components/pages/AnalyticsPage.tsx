import { BarChart3, TrendingUp, Users, FileText } from "lucide-react";
import { Badge } from "../ui/badge";

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="size-8 text-blue-600" />
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              <TrendingUp className="size-3 mr-1" />
              +12%
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Active Users</p>
          <p className="text-3xl font-bold text-gray-900">2,547</p>
          <p className="text-xs text-gray-500 mt-1">vs. last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="size-8 text-purple-600" />
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              <TrendingUp className="size-3 mr-1" />
              +18%
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Quizzes Completed</p>
          <p className="text-3xl font-bold text-gray-900">12,453</p>
          <p className="text-xs text-gray-500 mt-1">vs. last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="size-8 text-green-600" />
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              <TrendingUp className="size-3 mr-1" />
              +5%
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Quiz Score</p>
          <p className="text-3xl font-bold text-gray-900">72%</p>
          <p className="text-xs text-gray-500 mt-1">vs. last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="size-8 text-orange-600" />
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
              +2.3%
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">New Signups</p>
          <p className="text-3xl font-bold text-gray-900">342</p>
          <p className="text-xs text-gray-500 mt-1">this month</p>
        </div>
      </div>

      {/* Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Growth Trend
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="size-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Line chart visualization</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quiz Completion Rate
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="size-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Bar chart visualization</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Skill Performance Distribution
        </h3>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="size-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              Heatmap or scatter plot visualization
            </p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Students
          </h3>
          <div className="space-y-3">
            {[
              { name: "Sarah Johnson", score: 95, quizzes: 45 },
              { name: "Michael Chen", score: 92, quizzes: 38 },
              { name: "Emily Davis", score: 90, quizzes: 42 },
            ].map((student, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">
                      {student.quizzes} quizzes
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                  {student.score}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Most Popular Quizzes
          </h3>
          <div className="space-y-3">
            {[
              { name: "Algebra Basics", attempts: 892 },
              { name: "Geometry Fundamentals", attempts: 745 },
              { name: "Fractions Practice", attempts: 623 },
            ].map((quiz, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <p className="font-medium text-gray-900">{quiz.name}</p>
                </div>
                <Badge variant="outline">{quiz.attempts} attempts</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
