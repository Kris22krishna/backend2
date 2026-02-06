import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";

export default function AtRiskStudents() {
  const atRiskStudents = [
    { name: "Sarah Johnson", avatar: "SJ", score: 52, subject: "Top Categories", attendance: "63%", issue: "Low Attendance" },
    { name: "James Lee", avatar: "JL", score: 55, subject: "Tue Barills", attendance: "60%", issue: "Missing Assignments" },
    { name: "Emily Davis", avatar: "ED", score: 59, subject: "God's starts", attendance: "70%", issue: "Low Test Scores" },
    { name: "Michael Brown", avatar: "MB", score: 60, subject: "SEM mailbox", attendance: "68%", issue: "Inconsistent Work" },
    { name: "Ava Wilson", avatar: "AW", score: 62, subject: "Ava mailbox", attendance: "72%", issue: "Needs Support" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-orange-600" />
          <CardTitle>At-Risk Students</CardTitle>
        </div>
        <p className="text-sm text-gray-500">Students requiring immediate attention</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {atRiskStudents.map((student, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-orange-100"
            >
              <Avatar className="size-12">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium">{student.name}</h4>
                <p className="text-sm text-gray-500">{student.subject}</p>
                <Badge variant="outline" className="mt-1 text-xs bg-orange-50 text-orange-700 border-orange-200">
                  {student.issue}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-600">{student.score}</p>
                <p className="text-xs text-gray-600">{student.attendance}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
