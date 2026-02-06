import { useOutletContext } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Calendar, Trophy, TrendingUp, Star } from "lucide-react";

interface ContextType {
  selectedChild: {
    id: string;
    name: string;
    grade: string;
  };
}

const recentQuizzes = [
  {
    id: "1",
    name: "Multiplication Tables",
    score: 92,
    badge: "Excellent!",
    color: "bg-green-100 text-green-700",
    date: "Feb 2",
  },
  {
    id: "2",
    name: "Geometry Shapes",
    score: 88,
    badge: "Great Job!",
    color: "bg-green-100 text-green-700",
    date: "Feb 1",
  },
  {
    id: "3",
    name: "Fractions Basics",
    score: 52,
    badge: "Keep Going!",
    color: "bg-yellow-100 text-yellow-700",
    date: "Jan 31",
  },
  {
    id: "4",
    name: "Division Practice",
    score: 78,
    badge: "Good Work!",
    color: "bg-blue-100 text-blue-700",
    date: "Jan 30",
  },
];

const weeklyActivity = [
  { day: "M", active: true, count: 3 },
  { day: "T", active: true, count: 4 },
  { day: "W", active: true, count: 2 },
  { day: "T", active: true, count: 5 },
  { day: "F", active: true, count: 3 },
  { day: "S", active: true, count: 2 },
  { day: "S", active: true, count: 5 },
];

export function QuizzesPage() {
  const { selectedChild } = useOutletContext<ContextType>();

  return (
    <div className="space-y-8 max-w-5xl pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#31326F] flex items-center gap-3">
          <span className="text-4xl">📚</span>
          Quiz Results
        </h1>
        <p className="text-slate-600 mt-2">
          Celebrate {selectedChild.name}'s learning journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 bg-gradient-to-br from-[#A8FBD3]/20 to-white">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-[#31326F]">24</div>
            <div className="text-sm text-slate-600">Quizzes</div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-[#4FB7B3]/20 to-white">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-[#31326F]">82%</div>
            <div className="text-sm text-slate-600">Avg Score</div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-[#637AB9]/20 to-white">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-[#31326F]">12</div>
            <div className="text-sm text-slate-600">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-purple-200/30 to-white">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-3xl font-bold text-[#31326F]">8m</div>
            <div className="text-sm text-slate-600">Avg Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#31326F]">
            <Calendar className="h-5 w-5 text-[#4FB7B3]" />
            This Week's Activity 📅
          </CardTitle>
          <CardDescription>Every quiz brings us closer to mastery!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-3">
            {weeklyActivity.map((day, index) => (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                    day.active
                      ? "bg-gradient-to-br from-[#A8FBD3] to-[#4FB7B3] shadow-md"
                      : "bg-slate-100"
                  }`}
                >
                  <div className={`text-2xl font-bold ${day.active ? "text-[#31326F]" : "text-slate-400"}`}>
                    {day.active ? day.count : "-"}
                  </div>
                  <div className={`text-xs font-medium ${day.active ? "text-[#31326F]" : "text-slate-400"}`}>
                    {day.day}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-sm text-slate-600">
            <strong>24 quizzes</strong> completed this week - Amazing! 🌟
          </div>
        </CardContent>
      </Card>

      {/* Recent Quizzes */}
      <div>
        <h2 className="text-2xl font-semibold text-[#31326F] mb-4 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#4FB7B3]" />
          Recent Quizzes 🏆
        </h2>
        <div className="grid gap-4">
          {recentQuizzes.map((quiz) => (
            <Card key={quiz.id} className="border-2 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-6">
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#31326F] mb-1">
                      {quiz.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge className={quiz.color + " text-sm px-3 py-1"}>
                        {quiz.badge}
                      </Badge>
                      <span className="text-sm text-slate-500">{quiz.date}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <div
                      className={`text-4xl font-bold ${
                        quiz.score >= 80
                          ? "text-green-600"
                          : quiz.score >= 60
                          ? "text-yellow-600"
                          : "text-orange-600"
                      }`}
                    >
                      {quiz.score}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <Card className="border-2 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🎉</div>
            <div>
              <h3 className="font-semibold text-lg text-[#31326F] mb-2">
                Keep Up the Great Work!
              </h3>
              <p className="text-slate-700">
                <strong>{selectedChild.name}</strong> is showing consistent effort and improvement! 
                The 12-day streak shows amazing dedication. Consider a small reward to celebrate this milestone! 🌟
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}