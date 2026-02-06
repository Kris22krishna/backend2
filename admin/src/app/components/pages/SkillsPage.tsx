import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";

const mockSkills = [
  {
    id: "SKL-001",
    name: "Fractions",
    category: "Mathematics",
    avgAccuracy: 41,
    attempts: 1200,
    trend: "down",
    trendValue: -17,
    studentsStruggling: 245,
  },
  {
    id: "SKL-002",
    name: "Decimals",
    category: "Mathematics",
    avgAccuracy: 38,
    attempts: 1100,
    trend: "down",
    trendValue: -8,
    studentsStruggling: 312,
  },
  {
    id: "SKL-003",
    name: "Ratios",
    category: "Mathematics",
    avgAccuracy: 48,
    attempts: 980,
    trend: "stable",
    trendValue: 0,
    studentsStruggling: 198,
  },
  {
    id: "SKL-004",
    name: "Algebra Basics",
    category: "Mathematics",
    avgAccuracy: 68,
    attempts: 1450,
    trend: "up",
    trendValue: 12,
    studentsStruggling: 87,
  },
  {
    id: "SKL-005",
    name: "Geometry",
    category: "Mathematics",
    avgAccuracy: 72,
    attempts: 1350,
    trend: "up",
    trendValue: 5,
    studentsStruggling: 65,
  },
];

export function SkillsPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Skills</p>
          <p className="text-2xl font-bold text-gray-900">127</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Needs Attention</p>
          <p className="text-2xl font-bold text-red-600">23</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Performing Well</p>
          <p className="text-2xl font-bold text-green-600">89</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Avg Platform Accuracy</p>
          <p className="text-2xl font-bold text-blue-600">67%</p>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-red-600 text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-1">
            Skills Needing Immediate Attention
          </h3>
          <p className="text-sm text-red-700">
            23 skills have platform-wide accuracy below 50%. Consider reviewing
            content difficulty or providing additional resources.
          </p>
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            All Skills Performance
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Skill Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Avg Accuracy
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Attempts
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Trend
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Students Struggling
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockSkills.map((skill) => (
              <tr
                key={skill.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-3 rounded-full ${
                        skill.avgAccuracy < 40
                          ? "bg-red-500"
                          : skill.avgAccuracy < 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <span className="font-medium text-gray-900">
                      {skill.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {skill.category}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl ${
                        skill.avgAccuracy < 40
                          ? "🔴"
                          : skill.avgAccuracy < 50
                          ? "🟡"
                          : "🟢"
                      }`}
                    >
                      {skill.avgAccuracy < 40
                        ? "🔴"
                        : skill.avgAccuracy < 50
                        ? "🟡"
                        : "🟢"}
                    </span>
                    <span
                      className={`font-semibold ${
                        skill.avgAccuracy < 40
                          ? "text-red-600"
                          : skill.avgAccuracy < 50
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {skill.avgAccuracy}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{skill.attempts}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {skill.trend === "up" ? (
                      <>
                        <TrendingUp className="size-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          +{skill.trendValue}%
                        </span>
                      </>
                    ) : skill.trend === "down" ? (
                      <>
                        <TrendingDown className="size-4 text-red-600" />
                        <span className="text-red-600 font-medium">
                          {skill.trendValue}%
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">→ {skill.trendValue}%</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      skill.studentsStruggling > 200
                        ? "bg-red-100 text-red-700 border-red-200"
                        : skill.studentsStruggling > 100
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }
                  >
                    {skill.studentsStruggling}
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
