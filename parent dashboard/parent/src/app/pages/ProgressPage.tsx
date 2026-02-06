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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Star, Flame, Target } from "lucide-react";

interface ContextType {
  selectedChild: {
    id: string;
    name: string;
    grade: string;
  };
}

const weeklyProgress = [
  { week: "Week 1", accuracy: 72 },
  { week: "Week 2", accuracy: 75 },
  { week: "Week 3", accuracy: 78 },
  { week: "Week 4", accuracy: 82 },
];

const milestones = [
  {
    emoji: "🎯",
    title: "First 100 Questions!",
    date: "Jan 15, 2026",
    color: "bg-blue-100 text-blue-700",
  },
  {
    emoji: "🔥",
    title: "10-Day Streak Achieved",
    date: "Jan 28, 2026",
    color: "bg-orange-100 text-orange-700",
  },
  {
    emoji: "⭐",
    title: "First 90%+ Quiz Score",
    date: "Feb 1, 2026",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    emoji: "🏆",
    title: "12 Skills Mastered",
    date: "Feb 3, 2026",
    color: "bg-purple-100 text-purple-700",
  },
];

export function ProgressPage() {
  const { selectedChild } = useOutletContext<ContextType>();

  return (
    <div className="space-y-8 max-w-5xl pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#31326F] flex items-center gap-3">
          <span className="text-4xl">📈</span>
          Progress Tracker
        </h1>
        <p className="text-slate-600 mt-2">
          Watch {selectedChild.name}'s learning journey unfold
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 bg-gradient-to-br from-green-100 to-emerald-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-[#31326F]">+10%</div>
            <div className="text-sm text-slate-600 mt-1">Improvement</div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-orange-100 to-red-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-[#31326F]">12</div>
            <div className="text-sm text-slate-600 mt-1">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-[#A8FBD3] to-[#4FB7B3]/30">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-6 w-6 text-[#4FB7B3]" />
            </div>
            <div className="text-3xl font-bold text-[#31326F]">82%</div>
            <div className="text-sm text-slate-600 mt-1">Current</div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-purple-100 to-pink-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-[#31326F]">156</div>
            <div className="text-sm text-slate-600 mt-1">This Week</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-[#31326F]">
                <TrendingUp className="h-5 w-5 text-[#4FB7B3]" />
                Monthly Progress 📈
              </CardTitle>
              <CardDescription>
                Look at that beautiful upward trend!
              </CardDescription>
            </div>
            <Badge className="bg-green-600 text-white text-lg px-4 py-2">
              +10% This Month 🎉
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyProgress}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4FB7B3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4FB7B3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#4FB7B3"
                  fill="url(#colorAccuracy)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Started at <strong className="text-[#31326F]">72%</strong> and now at{" "}
              <strong className="text-[#4FB7B3]">82%</strong> - That's amazing growth! 🌟
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <div>
        <h2 className="text-2xl font-semibold text-[#31326F] mb-4 flex items-center gap-2">
          <span className="text-3xl">🏆</span>
          Milestones Achieved
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{milestone.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#31326F] mb-2">
                      {milestone.title}
                    </h3>
                    <Badge className={milestone.color}>
                      {milestone.date}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <Card className="border-2 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="text-7xl">🌟</div>
            <div>
              <h3 className="font-bold text-2xl text-[#31326F] mb-3">
                Incredible Progress!
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                <strong>{selectedChild.name}</strong> has improved by <strong>10% this month</strong> - 
                that's outstanding! The consistent 12-day streak shows real dedication to learning. 
                Celebrate these wins together! Consider creating a "milestone wall" at home to showcase 
                achievements. This positive momentum is building a strong foundation for lifelong learning! 🚀
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}