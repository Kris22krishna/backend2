import { useState } from "react";
import { Users, BookOpen, FileText, Activity, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StudentPerformance from "../components/StudentPerformance";
import TopPerformers from "../components/TopPerformers";
import AtRiskStudents from "../components/AtRiskStudents";

export default function Dashboard() {
  const [selectedGrade, setSelectedGrade] = useState("Grade 8");

  const stats = [
    {
      title: "Total Students",
      value: "120",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Courses",
      value: "5",
      subtitle: "Courses",
      icon: BookOpen,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending Assignments",
      value: "27",
      subtitle: "Students",
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Avg Engagement",
      value: "2h 15m",
      icon: Activity,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const todaySchedule = [
    { subject: "Algebra", time: "Apr 25, 11:30 AM", topic: "Quadratic Equations" },
    { subject: "Science", time: "Apr 24, 11:00 PM", topic: "Photosynthesis" },
  ];

  const completedAssignments = [
    { title: "Algebra 2 Homework", subject: "Math", date: "Apr 25", submitted: "16/20" },
    { title: "Photosynthesis Project", subject: "Science", date: "Apr 26", submitted: "18/25" },
    { title: "World War II Quiz", subject: "History", date: "Apr 23, 22/24", submitted: "22/24" },
  ];

  const topEngagedStudents = [
    { name: "Lucas Martin", avatar: "LM", activity: "Messages", time: "12h" },
    { name: "Olivia Carter", avatar: "OC", activity: "Late students science less", time: "11h 25m" },
    { name: "Ethan Brooks", avatar: "EB", activity: "Dillon studies science", time: "11h" },
    { name: "Grace Kim", avatar: "GK", activity: "Essie tensions overdue", time: "10h 45m" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 p-8">
        <Header title="Welcome, Mr. Smith" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <h3 className="text-3xl mb-1">{stat.value}</h3>
                    {stat.subtitle && (
                      <p className="text-sm text-gray-500">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="size-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <p className="text-sm text-gray-500">Topics: Endurance, message</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded">
                    <Calendar className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.subject}</h4>
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <p className="text-sm text-gray-600">Topic: {item.topic}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Teaching Insights - Completed Only */}
          <Card>
            <CardHeader>
              <CardTitle>Teaching Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Completed
                </Badge>
              </div>
              <div className="space-y-4">
                {completedAssignments.map((assignment, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded">
                      <FileText className="size-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{assignment.title}</h4>
                      <p className="text-xs text-gray-500">{assignment.subject} | {assignment.date}</p>
                    </div>
                    <div className="text-sm text-gray-600">{assignment.submitted} submitted</div>
                    <ChevronRight className="size-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Class Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Class Activity</CardTitle>
              <p className="text-sm text-gray-500">Top Engaged Students</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {topEngagedStudents.map((student, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">{student.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{student.name}</h4>
                    <p className="text-xs text-gray-500">{student.activity}</p>
                  </div>
                  <span className="text-sm text-gray-600">{student.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Student Performance */}
        <StudentPerformance selectedGrade={selectedGrade} />

        {/* Top Performers and At Risk Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopPerformers />
          <AtRiskStudents />
        </div>
      </div>
    </div>
  );
}