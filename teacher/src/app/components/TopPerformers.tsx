import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Trophy } from "lucide-react";

export default function TopPerformers() {
  const topStudents = [
    { name: "Emma Johnson", avatar: "EJ", score: 95, subject: "Mathematics", improvement: "+5%" },
    { name: "Michael Chen", avatar: "MC", score: 93, subject: "Science", improvement: "+8%" },
    { name: "Sophia Rodriguez", avatar: "SR", score: 92, subject: "Mathematics", improvement: "+3%" },
    { name: "Oliver Smith", avatar: "OS", score: 91, subject: "English", improvement: "+6%" },
    { name: "Isabella Brown", avatar: "IB", score: 90, subject: "History", improvement: "+4%" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-yellow-600" />
          <CardTitle>Top Performers</CardTitle>
        </div>
        <p className="text-sm text-gray-500">Highest achieving students this month</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topStudents.map((student, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    {student.avatar}
                  </AvatarFallback>
                </Avatar>
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    1
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{student.name}</h4>
                <p className="text-sm text-gray-500">{student.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{student.score}%</p>
                <p className="text-xs text-green-600">{student.improvement}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
