import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, TrendingDown, TrendingUp, Calculator } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export default function Assignments() {
  const [selectedGrade, setSelectedGrade] = useState("Grade 8");
  const [selectedPieSegment, setSelectedPieSegment] = useState<string | null>(null);
  const [selectedScoreRange, setSelectedScoreRange] = useState<string | null>(null);
  const [isPieDialogOpen, setIsPieDialogOpen] = useState(false);
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);

  const mathAssignments = [
    {
      title: "Quadratic Equations Worksheet",
      topic: "Algebra",
      totalStudents: 25,
      completed: 22,
      avgScore: 85,
      dueDate: "Feb 10, 2026",
      status: "active",
    },
    {
      title: "Geometry: Triangles Test",
      topic: "Geometry",
      totalStudents: 25,
      completed: 25,
      avgScore: 78,
      dueDate: "Feb 8, 2026",
      status: "completed",
    },
    {
      title: "Statistics Practice",
      topic: "Statistics",
      totalStudents: 25,
      completed: 18,
      avgScore: 72,
      dueDate: "Feb 12, 2026",
      status: "active",
    },
    {
      title: "Calculus Derivatives",
      topic: "Calculus",
      totalStudents: 25,
      completed: 15,
      avgScore: 68,
      dueDate: "Feb 14, 2026",
      status: "active",
    },
  ];

  const topicPerformance = [
    { topic: "Algebra", avgScore: 85, needsAttention: 3 },
    { topic: "Geometry", avgScore: 78, needsAttention: 5 },
    { topic: "Statistics", avgScore: 72, needsAttention: 8 },
    { topic: "Calculus", avgScore: 68, needsAttention: 10 },
    { topic: "Trigonometry", avgScore: 65, needsAttention: 12 },
  ];

  const completionData = [
    { name: "Completed", value: 80, color: "#10b981" },
    { name: "In Progress", value: 12, color: "#f59e0b" },
    { name: "Not Started", value: 8, color: "#ef4444" },
  ];

  // Student lists for pie chart segments with more details
  const studentsByStatus = {
    "Completed": [
      { name: "Emma Johnson", grade: "Grade 8", status: "Completed" },
      { name: "Liam Smith", grade: "Grade 8", status: "Completed" },
      { name: "Olivia Brown", grade: "Grade 8", status: "Completed" },
      { name: "Noah Davis", grade: "Grade 8", status: "Completed" },
      { name: "Ava Wilson", grade: "Grade 8", status: "Completed" },
      { name: "Ethan Martinez", grade: "Grade 8", status: "Completed" },
      { name: "Sophia Anderson", grade: "Grade 8", status: "Completed" },
      { name: "Mason Taylor", grade: "Grade 8", status: "Completed" },
      { name: "Isabella Thomas", grade: "Grade 8", status: "Completed" },
      { name: "James Jackson", grade: "Grade 8", status: "Completed" },
      { name: "Mia White", grade: "Grade 8", status: "Completed" },
      { name: "Benjamin Harris", grade: "Grade 8", status: "Completed" },
      { name: "Charlotte Martin", grade: "Grade 8", status: "Completed" },
      { name: "Lucas Garcia", grade: "Grade 8", status: "Completed" },
      { name: "Amelia Robinson", grade: "Grade 8", status: "Completed" },
    ],
    "In Progress": [
      { name: "Harper Lee", grade: "Grade 8", status: "In Progress" },
      { name: "Alexander Clark", grade: "Grade 8", status: "In Progress" },
      { name: "Evelyn Lewis", grade: "Grade 8", status: "In Progress" },
      { name: "Michael Walker", grade: "Grade 8", status: "In Progress" },
    ],
    "Not Started": [
      { name: "Abigail Hall", grade: "Grade 8", status: "Not Started" },
      { name: "Daniel Allen", grade: "Grade 8", status: "Not Started" },
    ],
  };

  const scoreDistribution = [
    { range: "90-100", count: 8 },
    { range: "80-89", count: 12 },
    { range: "70-79", count: 15 },
    { range: "60-69", count: 10 },
    { range: "Below 60", count: 5 },
  ];

  // Students by score range
  const studentsByScoreRange = {
    "90-100": [
      "Emma Johnson", "Liam Smith", "Olivia Brown", "Noah Davis", "Ava Wilson",
      "Ethan Martinez", "Sophia Anderson", "Mason Taylor"
    ],
    "80-89": [
      "Isabella Thomas", "James Jackson", "Mia White", "Benjamin Harris", "Charlotte Martin",
      "Lucas Garcia", "Amelia Robinson", "Harper Lee", "Alexander Clark", "Evelyn Lewis",
      "Michael Walker", "Abigail Hall"
    ],
    "70-79": [
      "Daniel Allen", "Emily Young", "Matthew King", "Ella Wright", "Jackson Scott",
      "Avery Green", "Sebastian Baker", "Scarlett Adams", "Logan Nelson", "Grace Carter",
      "Owen Mitchell", "Chloe Perez", "Aiden Roberts", "Lily Turner", "Carter Phillips"
    ],
    "60-69": [
      "Zoey Campbell", "Grayson Parker", "Penelope Evans", "Wyatt Edwards", "Layla Collins",
      "Jack Stewart", "Riley Morris", "Luke Rogers", "Hannah Reed", "Henry Cook"
    ],
    "Below 60": [
      "Aria Morgan", "Dylan Bell", "Nora Murphy", "Ryan Bailey", "Zoe Rivera"
    ],
  };

  const getStatusColor = (status: string) => {
    return status === "completed" 
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-blue-50 text-blue-700 border-blue-200";
  };

  const handlePieClick = (data: any) => {
    setSelectedPieSegment(data.name);
    setIsPieDialogOpen(true);
  };

  const handleScoreBarClick = (data: any) => {
    setSelectedScoreRange(data.range);
    setIsScoreDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <Header title="Assignment Management" />

        {/* Grade Navigation */}
        <div className="mb-8">
          <Tabs value={selectedGrade} onValueChange={setSelectedGrade}>
            <TabsList>
              <TabsTrigger value="Grade 6">Grade 6</TabsTrigger>
              <TabsTrigger value="Grade 7">Grade 7</TabsTrigger>
              <TabsTrigger value="Grade 8">Grade 8</TabsTrigger>
              <TabsTrigger value="Grade 9">Grade 9</TabsTrigger>
              <TabsTrigger value="Grade 10">Grade 10</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">80</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <Clock className="size-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                  <AlertCircle className="size-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">76%</p>
                  <p className="text-sm text-gray-600">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                  <Calculator className="size-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-gray-600">Active Assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Assignment Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Completion</CardTitle>
              <p className="text-sm text-gray-500">Overall completion status</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onClick={handlePieClick}
                      style={{ cursor: 'pointer' }}
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">Click on any segment to view students</p>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <p className="text-sm text-gray-500">Mathematics assignments</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      fill="#3b82f6" 
                      name="Students"
                      onClick={handleScoreBarClick}
                      style={{ cursor: 'pointer' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">Click on any bar to view students</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Status Modal */}
        <Dialog open={isPieDialogOpen} onOpenChange={setIsPieDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Students - {selectedPieSegment}</DialogTitle>
              <DialogDescription>
                List of students with {selectedPieSegment?.toLowerCase()} status
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Grade</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedPieSegment && studentsByStatus[selectedPieSegment as keyof typeof studentsByStatus]?.map((student, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.grade}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="outline" 
                          className={
                            student.status === "Completed" 
                              ? "bg-green-50 text-green-700 border-green-200"
                              : student.status === "In Progress"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {student.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>

        {/* Score Range Modal */}
        <Dialog open={isScoreDialogOpen} onOpenChange={setIsScoreDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Students - Score Range: {selectedScoreRange}</DialogTitle>
              <DialogDescription>
                List of students with scores in the {selectedScoreRange} range
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {selectedScoreRange && studentsByScoreRange[selectedScoreRange as keyof typeof studentsByScoreRange]?.map((student, idx) => (
                  <div key={idx} className="p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                    <span className="text-sm font-medium">{student}</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {selectedScoreRange}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Mathematics Assignments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mathematics Assignments - {selectedGrade}</CardTitle>
            <p className="text-sm text-gray-500">Track completion and performance</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mathAssignments.map((assignment, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <Badge variant="outline" className={getStatusColor(assignment.status)}>
                          {assignment.status === "completed" ? "Completed" : "Active"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Topic: {assignment.topic} | Due: {assignment.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{assignment.avgScore}%</p>
                      <p className="text-sm text-gray-500">Avg Score</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                      <Progress 
                        value={(assignment.completed / assignment.totalStudents) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {assignment.completed} / {assignment.totalStudents} students
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Performance</p>
                      <div className="flex items-center gap-2">
                        {assignment.avgScore >= 80 ? (
                          <TrendingUp className="size-4 text-green-600" />
                        ) : (
                          <TrendingDown className="size-4 text-red-600" />
                        )}
                        <span className={`text-sm ${assignment.avgScore >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                          {assignment.avgScore >= 80 ? 'Above Average' : 'Needs Attention'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Topics Needing Focus */}
        <Card>
          <CardHeader>
            <CardTitle>Mathematics Topics - Focus Areas</CardTitle>
            <p className="text-sm text-gray-500">Topics requiring additional attention</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topicPerformance.map((topic, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{topic.topic}</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        Avg Score: <span className="font-bold">{topic.avgScore}%</span>
                      </span>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {topic.needsAttention} students need help
                      </Badge>
                    </div>
                  </div>
                  <Progress value={topic.avgScore} className="h-2" />
                  <div className="mt-2 flex items-center gap-2">
                    {topic.avgScore < 70 && (
                      <>
                        <AlertCircle className="size-4 text-red-600" />
                        <p className="text-sm text-red-600">High Priority - Schedule review session</p>
                      </>
                    )}
                    {topic.avgScore >= 70 && topic.avgScore < 80 && (
                      <>
                        <AlertCircle className="size-4 text-orange-600" />
                        <p className="text-sm text-orange-600">Medium Priority - Additional practice recommended</p>
                      </>
                    )}
                    {topic.avgScore >= 80 && (
                      <>
                        <CheckCircle2 className="size-4 text-green-600" />
                        <p className="text-sm text-green-600">Good Performance - Continue current approach</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}