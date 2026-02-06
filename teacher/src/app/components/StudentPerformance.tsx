import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Award, AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface StudentPerformanceProps {
  selectedGrade: string;
}

export default function StudentPerformance({ selectedGrade }: StudentPerformanceProps) {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  // Math topics performance data
  const performanceData = [
    { week: "Week 1", Fractions: 65, Decimals: 58, Ratios: 62, Percentages: 55, Algebra: 50, Geometry: 60, Mensuration: 52, "Data Handling": 57, Integers: 63 },
    { week: "Week 2", Fractions: 68, Decimals: 62, Ratios: 65, Percentages: 59, Algebra: 55, Geometry: 63, Mensuration: 56, "Data Handling": 60, Integers: 66 },
    { week: "Week 3", Fractions: 72, Decimals: 66, Ratios: 68, Percentages: 63, Algebra: 58, Geometry: 67, Mensuration: 60, "Data Handling": 64, Integers: 70 },
    { week: "Week 4", Fractions: 75, Decimals: 70, Ratios: 72, Percentages: 67, Algebra: 62, Geometry: 70, Mensuration: 64, "Data Handling": 68, Integers: 74 },
    { week: "Week 5", Fractions: 78, Decimals: 74, Ratios: 76, Percentages: 71, Algebra: 68, Geometry: 74, Mensuration: 68, "Data Handling": 72, Integers: 78 },
  ];

  // Topic-specific performance data
  const topicPerformanceData = {
    "All Topics": performanceData,
    "Fractions": [
      { week: "Week 1", score: 65 },
      { week: "Week 2", score: 68 },
      { week: "Week 3", score: 72 },
      { week: "Week 4", score: 75 },
      { week: "Week 5", score: 78 },
    ],
    "Decimals": [
      { week: "Week 1", score: 58 },
      { week: "Week 2", score: 62 },
      { week: "Week 3", score: 66 },
      { week: "Week 4", score: 70 },
      { week: "Week 5", score: 74 },
    ],
    "Ratios": [
      { week: "Week 1", score: 62 },
      { week: "Week 2", score: 65 },
      { week: "Week 3", score: 68 },
      { week: "Week 4", score: 72 },
      { week: "Week 5", score: 76 },
    ],
    "Percentages": [
      { week: "Week 1", score: 55 },
      { week: "Week 2", score: 59 },
      { week: "Week 3", score: 63 },
      { week: "Week 4", score: 67 },
      { week: "Week 5", score: 71 },
    ],
    "Algebra": [
      { week: "Week 1", score: 50 },
      { week: "Week 2", score: 55 },
      { week: "Week 3", score: 58 },
      { week: "Week 4", score: 62 },
      { week: "Week 5", score: 68 },
    ],
    "Geometry": [
      { week: "Week 1", score: 60 },
      { week: "Week 2", score: 63 },
      { week: "Week 3", score: 67 },
      { week: "Week 4", score: 70 },
      { week: "Week 5", score: 74 },
    ],
    "Mensuration": [
      { week: "Week 1", score: 52 },
      { week: "Week 2", score: 56 },
      { week: "Week 3", score: 60 },
      { week: "Week 4", score: 64 },
      { week: "Week 5", score: 68 },
    ],
    "Data Handling": [
      { week: "Week 1", score: 57 },
      { week: "Week 2", score: 60 },
      { week: "Week 3", score: 64 },
      { week: "Week 4", score: 68 },
      { week: "Week 5", score: 72 },
    ],
    "Integers": [
      { week: "Week 1", score: 63 },
      { week: "Week 2", score: 66 },
      { week: "Week 3", score: 70 },
      { week: "Week 4", score: 74 },
      { week: "Week 5", score: 78 },
    ],
  };

  const mathTopics = [
    { topic: "Fractions", score: 78, color: "bg-green-500" },
    { topic: "Integers", score: 78, color: "bg-green-500" },
    { topic: "Ratios", score: 76, color: "bg-green-500" },
    { topic: "Decimals", score: 74, color: "bg-blue-500" },
    { topic: "Geometry", score: 74, color: "bg-blue-500" },
    { topic: "Data Handling", score: 72, color: "bg-blue-500" },
    { topic: "Percentages", score: 71, color: "bg-yellow-500" },
    { topic: "Mensuration", score: 68, color: "bg-yellow-500" },
    { topic: "Algebra", score: 68, color: "bg-yellow-500" },
  ];

  const topics = [
    { name: "Fractions", color: "#10b981", icon: "🔢" },
    { name: "Decimals", color: "#3b82f6", icon: "📊" },
    { name: "Ratios", color: "#ef4444", icon: "⚖️" },
    { name: "Percentages", color: "#f59e0b", icon: "💯" },
    { name: "Algebra", color: "#8b5cf6", icon: "🔤" },
    { name: "Geometry", color: "#ec4899", icon: "📐" },
    { name: "Mensuration", color: "#14b8a6", icon: "📏" },
    { name: "Data Handling", color: "#f97316", icon: "📈" },
    { name: "Integers", color: "#06b6d4", icon: "🔢" },
  ];

  const getCurrentData = () => {
    if (selectedTopic === "All Topics") {
      return performanceData;
    }
    return topicPerformanceData[selectedTopic as keyof typeof topicPerformanceData];
  };

  const getTopicColor = (topicName: string) => {
    return topics.find(t => t.name === topicName)?.color || "#3b82f6";
  };

  return (
    <div className="space-y-6 mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mathematics Performance - {selectedGrade}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Average cumulative performance over last 5 weeks</p>
            </div>
            <div className="w-48">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Topics">All Topics</SelectItem>
                  <SelectItem value="Fractions">Fractions</SelectItem>
                  <SelectItem value="Decimals">Decimals</SelectItem>
                  <SelectItem value="Ratios">Ratios</SelectItem>
                  <SelectItem value="Percentages">Percentages</SelectItem>
                  <SelectItem value="Algebra">Algebra</SelectItem>
                  <SelectItem value="Geometry">Geometry</SelectItem>
                  <SelectItem value="Mensuration">Mensuration</SelectItem>
                  <SelectItem value="Data Handling">Data Handling</SelectItem>
                  <SelectItem value="Integers">Integers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Color Legend */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Mathematics Topics</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <div key={topic.name} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: topic.color }}
                  />
                  <span className="text-sm">{topic.icon} {topic.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              {selectedTopic === "All Topics" ? (
                <LineChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  {topics.map((topic) => (
                    <Line
                      key={topic.name}
                      type="monotone"
                      dataKey={topic.name}
                      stroke={topic.color}
                      strokeWidth={2}
                      dot={{ fill: topic.color, r: 4 }}
                    />
                  ))}
                </LineChart>
              ) : (
                <LineChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={getTopicColor(selectedTopic)}
                    strokeWidth={2}
                    dot={{ fill: getTopicColor(selectedTopic), r: 4 }}
                    name={selectedTopic}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="bg-blue-600 text-white p-3 rounded-lg">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">71%</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="bg-green-600 text-white p-3 rounded-lg">
                <Award className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">82%</p>
                <p className="text-sm text-gray-600">Top 5 Students</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <div className="bg-orange-600 text-white p-3 rounded-lg">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">54%</p>
                <p className="text-sm text-gray-600">Bottom 5 Students</p>
              </div>
            </div>
          </div>

          {/* Math Topics Performance */}
          <div>
            <h4 className="text-sm font-medium mb-4">Mathematics Topic Mastery</h4>
            <div className="space-y-3">
              {mathTopics.map((topic, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{topic.topic}</span>
                    <span className="text-sm text-gray-600">{topic.score}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${topic.color} transition-all duration-500`}
                      style={{ width: `${topic.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Excellent (80-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>Good (70-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded" />
                <span>Average (60-69%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded" />
                <span>Below Average (50-59%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span>Needs Attention (&lt;50%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}