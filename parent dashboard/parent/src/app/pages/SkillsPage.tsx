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
import { Progress } from "@/app/components/ui/progress";
import { Sparkles, Target, TrendingUp } from "lucide-react";

interface ContextType {
  selectedChild: {
    id: string;
    name: string;
    grade: string;
  };
}

const masteredSkills = [
  { emoji: "🎯", name: "Multiplication Tables", accuracy: 92, status: "Mastered!" },
  { emoji: "📐", name: "Geometry Shapes", accuracy: 88, status: "Mastered!" },
  { emoji: "🔢", name: "Place Value", accuracy: 95, status: "Mastered!" },
  { emoji: "➗", name: "Basic Division", accuracy: 85, status: "Mastered!" },
  { emoji: "📊", name: "Data & Graphs", accuracy: 90, status: "Mastered!" },
];

const improvingSkills = [
  { emoji: "🌟", name: "Fractions", accuracy: 52, progress: 52, color: "bg-yellow-500" },
  { emoji: "💪", name: "Long Division", accuracy: 58, progress: 58, color: "bg-blue-500" },
  { emoji: "📝", name: "Word Problems", accuracy: 65, progress: 65, color: "bg-purple-500" },
];

export function SkillsPage() {
  const { selectedChild } = useOutletContext<ContextType>();

  return (
    <div className="space-y-8 max-w-5xl pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#31326F] flex items-center gap-3">
          <span className="text-4xl">🧠</span>
          Skills Overview
        </h1>
        <p className="text-slate-600 mt-2">
          Track {selectedChild.name}'s learning progress
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 bg-gradient-to-br from-green-100 to-emerald-50">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-3">✅</div>
            <div className="text-4xl font-bold text-[#31326F] mb-1">12</div>
            <div className="text-sm text-slate-600">Skills Mastered</div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-[#A8FBD3] to-[#4FB7B3]/30">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <div className="text-4xl font-bold text-[#31326F] mb-1">8</div>
            <div className="text-sm text-slate-600">Skills Improving</div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-yellow-100 to-orange-50">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-3">🎯</div>
            <div className="text-4xl font-bold text-[#31326F] mb-1">3</div>
            <div className="text-sm text-slate-600">Need Practice</div>
          </CardContent>
        </Card>
      </div>

      {/* Mastered Skills */}
      <Card className="border-2 border-[#4FB7B3]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#4FB7B3]" />
            <CardTitle className="text-[#31326F]">Mastered Skills 🏆</CardTitle>
          </div>
          <CardDescription>
            These skills are absolutely crushing it! 80%+ accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {masteredSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200"
              >
                <div className="text-5xl">{skill.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg text-[#31326F]">
                    {skill.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-green-600 text-white">
                      {skill.status}
                    </Badge>
                    <span className="text-sm text-slate-600">
                      {skill.accuracy}% accuracy
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improving Skills */}
      <Card className="border-2 border-[#637AB9]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#637AB9]" />
            <CardTitle className="text-[#31326F]">Growing Skills 🌱</CardTitle>
          </div>
          <CardDescription>
            Keep practicing - every attempt brings improvement!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {improvingSkills.map((skill, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{skill.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-lg text-[#31326F]">
                        {skill.name}
                      </div>
                      <div className="text-2xl font-bold text-[#637AB9]">
                        {skill.accuracy}%
                      </div>
                    </div>
                    <Progress value={skill.progress} className="h-3" />
                    <div className="text-sm text-slate-600 mt-1">
                      Almost there! Keep going! 💪
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-6 bg-[#637AB9] hover:bg-[#637AB9]/90 text-white">
            Get Practice Recommendations
          </Button>
        </CardContent>
      </Card>

      {/* Motivation Card */}
      <Card className="border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-6xl">🎉</div>
            <div>
              <h3 className="font-bold text-xl text-[#31326F] mb-2">
                Amazing Progress!
              </h3>
              <p className="text-slate-700 leading-relaxed">
                <strong>{selectedChild.name}</strong> has mastered <strong>12 skills</strong> this month! 
                That's incredible dedication and hard work. The improvement in multiplication and geometry 
                shows real mathematical thinking. Keep encouraging practice with fractions through fun 
                activities like baking or cutting pizzas - making math real makes it stick! 🍕📚
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}