import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { CalendarCheck, UserX, TrendingUp, AlertTriangle, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "../components/ui/button";
import * as XLSX from "xlsx";

export default function Attendance() {
  const [selectedGrade, setSelectedGrade] = useState("Grade 8");

  const attendanceStats = [
    { title: "Class Average", value: "84.3%", icon: CalendarCheck, color: "bg-blue-100 text-blue-600" },
    { title: "Present Today", value: "23/25", icon: TrendingUp, color: "bg-green-100 text-green-600" },
    { title: "Absent Today", value: "2", icon: UserX, color: "bg-red-100 text-red-600" },
    { title: "Below 75%", value: "4 Students", icon: AlertTriangle, color: "bg-orange-100 text-orange-600" },
  ];

  const attendanceTrend = [
    { week: "Week 1", attendance: 88 },
    { week: "Week 2", attendance: 86 },
    { week: "Week 3", attendance: 90 },
    { week: "Week 4", attendance: 82 },
    { week: "Week 5", attendance: 84 },
  ];

  const studentAttendance = [
    {
      id: 1,
      name: "Emma Johnson",
      avatar: "EJ",
      totalClasses: 50,
      attended: 49,
      percentage: 98,
      missedLast7Days: 0,
      activity: "High",
      trend: "stable",
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "MC",
      totalClasses: 50,
      attended: 48,
      percentage: 96,
      missedLast7Days: 1,
      activity: "High",
      trend: "stable",
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      avatar: "SR",
      totalClasses: 50,
      attended: 47,
      percentage: 94,
      missedLast7Days: 1,
      activity: "High",
      trend: "stable",
    },
    {
      id: 4,
      name: "Oliver Smith",
      avatar: "OS",
      totalClasses: 50,
      attended: 45,
      percentage: 90,
      missedLast7Days: 2,
      activity: "Medium",
      trend: "declining",
    },
    {
      id: 5,
      name: "Isabella Brown",
      avatar: "IB",
      totalClasses: 50,
      attended: 46,
      percentage: 92,
      missedLast7Days: 1,
      activity: "High",
      trend: "stable",
    },
    {
      id: 6,
      name: "Lucas Martin",
      avatar: "LM",
      totalClasses: 50,
      attended: 42,
      percentage: 84,
      missedLast7Days: 3,
      activity: "Medium",
      trend: "declining",
    },
    {
      id: 7,
      name: "Olivia Carter",
      avatar: "OC",
      totalClasses: 50,
      attended: 43,
      percentage: 86,
      missedLast7Days: 2,
      activity: "Medium",
      trend: "declining",
    },
    {
      id: 8,
      name: "Ethan Brooks",
      avatar: "EB",
      totalClasses: 50,
      attended: 40,
      percentage: 80,
      missedLast7Days: 4,
      activity: "Low",
      trend: "declining",
    },
    {
      id: 9,
      name: "Grace Kim",
      avatar: "GK",
      totalClasses: 50,
      attended: 38,
      percentage: 76,
      missedLast7Days: 5,
      activity: "Low",
      trend: "declining",
    },
    {
      id: 10,
      name: "Sarah Johnson",
      avatar: "SJ",
      totalClasses: 50,
      attended: 32,
      percentage: 64,
      missedLast7Days: 6,
      activity: "Low",
      trend: "critical",
    },
  ];

  const recentAbsences = [
    { name: "Sarah Johnson", date: "Feb 4, 2026", reason: "Illness", consecutive: 3 },
    { name: "Grace Kim", date: "Feb 4, 2026", reason: "Family Emergency", consecutive: 2 },
    { name: "Ethan Brooks", date: "Feb 3, 2026", reason: "Medical Appointment", consecutive: 1 },
    { name: "Lucas Martin", date: "Feb 3, 2026", reason: "Unexcused", consecutive: 1 },
  ];

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-50";
    if (percentage >= 80) return "text-blue-600 bg-blue-50";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "High":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "stable":
        return "→";
      case "declining":
        return "↓";
      case "critical":
        return "⚠️";
      default:
        return "→";
    }
  };

  const exportToExcel = () => {
    const worksheetData = [
      ["ID", "Student Name", "Total Classes", "Attended", "Attendance %", "Missed (Last 7 Days)", "Class Activity", "Trend"],
      ...studentAttendance.map((student) => [
        student.id,
        student.name,
        student.totalClasses,
        student.attended,
        `${student.percentage}%`,
        student.missedLast7Days,
        student.activity,
        student.trend,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_record.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <Header title="Attendance Management" />

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

        {/* Attendance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {attendanceStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attendance Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Attendance Trend - Last 5 Weeks</CardTitle>
            <p className="text-sm text-gray-500">Class attendance percentage over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis label={{ value: 'Attendance %', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 6 }}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Absences */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Absences</CardTitle>
              <p className="text-sm text-gray-500">Students who missed class today</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAbsences.map((absence, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarFallback className="bg-red-100 text-red-600">
                        {absence.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{absence.name}</h4>
                      <p className="text-sm text-gray-500">{absence.date}</p>
                      <p className="text-xs text-gray-600 mt-1">Reason: {absence.reason}</p>
                      {absence.consecutive > 1 && (
                        <Badge variant="outline" className="mt-2 bg-red-50 text-red-700 border-red-200">
                          {absence.consecutive} consecutive days
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* At-Risk Attendance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Students with Low Attendance</CardTitle>
              <p className="text-sm text-gray-500">Below 80% attendance - Requires intervention</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentAttendance.filter(s => s.percentage < 80).map((student) => (
                  <div key={student.id} className="flex items-center gap-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-orange-600 text-white">
                        {student.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-gray-600">
                        {student.attended}/{student.totalClasses} classes attended
                      </p>
                      <p className="text-sm text-gray-600">
                        Missed {student.missedLast7Days} of last 7 classes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{student.percentage}%</p>
                      <Badge variant="outline" className="mt-1 bg-red-50 text-red-700 border-red-200">
                        Action Required
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Attendance Record - {selectedGrade}</CardTitle>
            <p className="text-sm text-gray-500">Detailed attendance and class activity for all students</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead className="min-w-[200px]">Student Name</TableHead>
                    <TableHead className="text-center">Total Classes</TableHead>
                    <TableHead className="text-center">Attended</TableHead>
                    <TableHead className="text-center">Attendance %</TableHead>
                    <TableHead className="text-center">Missed (Last 7 Days)</TableHead>
                    <TableHead className="text-center">Class Activity</TableHead>
                    <TableHead className="text-center">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttendance.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-600 text-white">
                              {student.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{student.totalClasses}</TableCell>
                      <TableCell className="text-center">{student.attended}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getAttendanceColor(student.percentage)}>
                          {student.percentage}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={student.missedLast7Days > 3 ? 'text-red-600 font-bold' : ''}>
                          {student.missedLast7Days}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getActivityColor(student.activity)}>
                          {student.activity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {getTrendIcon(student.trend)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-right">
              <Button onClick={exportToExcel} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Download className="size-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}