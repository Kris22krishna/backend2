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
  Sparkles,
  Trophy,
  Flame,
  Star,
  Heart,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

interface ContextType {
  selectedChild: {
    id: string;
    name: string;
    grade: string;
  };
}

export function DashboardPage() {
  const { selectedChild } = useOutletContext<ContextType>();

  const strengths = [
    { icon: "⚡", title: "Quick Learner", desc: "Completes quizzes 40% faster than average", color: "bg-yellow-100 text-yellow-700" },
    { icon: "🎯", title: "Super Focused", desc: "12-day study streak! Amazing consistency", color: "bg-orange-100 text-orange-700" },
    { icon: "🧠", title: "Math Whiz", desc: "92% accuracy in multiplication", color: "bg-purple-100 text-purple-700" },
  ];

  const weeklyActivity = [
    { day: "Mon", emoji: "🔥", active: true },
    { day: "Tue", emoji: "⭐", active: true },
    { day: "Wed", emoji: "💫", active: true },
    { day: "Thu", emoji: "✨", active: true },
    { day: "Fri", emoji: "🌟", active: true },
    { day: "Sat", emoji: "💪", active: true },
    { day: "Sun", emoji: "🎯", active: true },
  ];

  return (
    <div className="space-y-8 max-w-6xl pb-8">
      {/* Hero Section with Mascot */}
      <div className="bg-gradient-to-br from-[#A8FBD3] via-[#4FB7B3] to-[#637AB9] rounded-3xl p-8 md:p-12 text-[#31326F] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-6xl opacity-20">✨</div>
        <div className="absolute bottom-4 left-4 text-5xl opacity-20">🌟</div>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Mascot */}
          <div className="text-8xl md:text-9xl animate-bounce">🦊</div>
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">Today's Highlights</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {selectedChild.name} is Doing Amazing! 🎉
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Your child has mastered <strong>12 new skills</strong> this month and maintains an <strong>82% accuracy rate</strong>. Keep up the fantastic work!
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-3 min-w-32">
                <div className="text-2xl font-bold">82%</div>
                <div className="text-xs opacity-90">Accuracy</div>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-3 min-w-32">
                <div className="text-2xl font-bold flex items-center gap-1">
                  <Flame className="h-6 w-6 text-orange-500" />
                  12
                </div>
                <div className="text-xs opacity-90">Day Streak</div>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-3 min-w-32">
                <div className="text-2xl font-bold">156</div>
                <div className="text-xs opacity-90">This Week</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Strengths */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-6 w-6 text-[#4FB7B3]" />
          <h2 className="text-2xl font-semibold text-[#31326F]">Top Strengths 💪</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strengths.map((strength, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{strength.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#31326F] mb-1">
                      {strength.title}
                    </h3>
                    <p className="text-sm text-slate-600">{strength.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Activity */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#4FB7B3]" />
            <CardTitle>This Week's Activity</CardTitle>
          </div>
          <CardDescription>Look at this amazing consistency!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-2">
            {weeklyActivity.map((day, index) => (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${
                    day.active
                      ? "bg-gradient-to-br from-[#A8FBD3] to-[#4FB7B3] shadow-lg scale-105"
                      : "bg-slate-100"
                  }`}
                >
                  <div className={`text-sm font-medium ${day.active ? "text-[#31326F]" : "text-slate-400"}`}>
                    {day.day}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full">
              <Flame className="h-5 w-5" />
              <span className="font-semibold">12 Day Streak - Incredible!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Journey */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Mastered */}
        <Card className="border-2 border-[#4FB7B3] bg-gradient-to-br from-white to-[#A8FBD3]/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-3xl">🎓</div>
                <CardTitle className="text-[#31326F]">Skills Mastered</CardTitle>
              </div>
              <Badge className="bg-[#4FB7B3] text-white text-lg px-3 py-1">12</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <div className="font-medium text-[#31326F]">Multiplication Tables</div>
                  <div className="text-sm text-slate-500">92% accuracy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <div className="font-medium text-[#31326F]">Geometry Shapes</div>
                  <div className="text-sm text-slate-500">88% accuracy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <div className="font-medium text-[#31326F]">Place Value</div>
                  <div className="text-sm text-slate-500">95% accuracy</div>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-[#4FB7B3] hover:bg-[#4FB7B3]/90 text-white">
              View All Skills
            </Button>
          </CardContent>
        </Card>

        {/* Areas to Grow */}
        <Card className="border-2 border-[#637AB9] bg-gradient-to-br from-white to-[#637AB9]/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-3xl">🌱</div>
                <CardTitle className="text-[#31326F]">Growing Skills</CardTitle>
              </div>
              <Badge className="bg-[#637AB9] text-white text-lg px-3 py-1">3</Badge>
            </div>
            <CardDescription>Practice makes perfect!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-yellow-200">
                <div className="text-2xl">🌟</div>
                <div className="flex-1">
                  <div className="font-medium text-[#31326F]">Fractions</div>
                  <div className="text-sm text-slate-500">Getting better - 45% → 52%</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="text-2xl">💪</div>
                <div className="flex-1">
                  <div className="font-medium text-[#31326F]">Long Division</div>
                  <div className="text-sm text-slate-500">52% accuracy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="text-2xl">🎯</div>
                <div className="flex-1">
                  <div className="font-medium text-[#31326F]">Word Problems</div>
                  <div className="text-sm text-slate-500">58% accuracy</div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 border-[#637AB9] text-[#637AB9] hover:bg-[#637AB9]/10">
              Practice Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Encouraging Message */}
      <Card className="border-2 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl">💬</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-[#31326F] mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Encouragement Note
              </h3>
              <p className="text-slate-700 leading-relaxed">
                <strong>{selectedChild.name}</strong> shows exceptional dedication with a 12-day learning streak! 
                Their quick progress in multiplication and geometry demonstrates strong problem-solving skills. 
                Consider celebrating this milestone together and encouraging continued practice with fractions 
                through fun, real-world activities like cooking or measuring. You're raising a confident learner! 🌟
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}