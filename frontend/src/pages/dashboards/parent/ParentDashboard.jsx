import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    Trophy,
    Flame,
    Star,
    Heart,
} from "lucide-react";
import { api } from "@/services/api";

export default function ParentDashboard() {
    const { selectedChild } = useOutletContext();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            if (!selectedChild?.student_id) return;

            setLoading(true);
            try {
                const data = await api.getParentStats(selectedChild.student_id);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [selectedChild]);

    // Fallback/Loading UI could be improved here
    if (!selectedChild) return null;
    if (loading || !stats) return <div className="p-12 text-center animate-pulse">Loading amazing stats...</div>;

    const { accuracy, streak, weekly_activity, strengths, mastered_skills, growing_skills } = stats;

    // Helper to get color/desc for stats (since backend sends raw data)
    const getStrengthMeta = (index) => {
        const metas = [
            { icon: "⚡", color: "bg-yellow-100 text-yellow-700", desc: "Performs exceptionally quickly" },
            { icon: "🎯", color: "bg-orange-100 text-orange-700", desc: "Maintains high consistency" },
            { icon: "🧠", color: "bg-purple-100 text-purple-700", desc: "Shows deep understanding" },
        ];
        return metas[index % metas.length];
    };

    return (
        <div className="space-y-8 max-w-6xl pb-8 animate-fade-in">
            {/* Hero Section with Mascot */}
            <div className="bg-gradient-to-br from-[#A8FBD3] via-[#4FB7B3] to-[#637AB9] rounded-3xl p-8 md:p-12 text-[#31326F] relative overflow-hidden shadow-lg">
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 text-6xl opacity-20 animate-pulse">✨</div>
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
                            Your child has mastered <strong>{mastered_skills.length} new skills</strong> this month and maintains an <strong>{accuracy}% accuracy rate</strong>. Keep up the fantastic work!
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-3 min-w-32">
                                <div className="text-2xl font-bold">{accuracy}%</div>
                                <div className="text-xs opacity-90">Accuracy</div>
                            </div>
                            <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-3 min-w-32">
                                <div className="text-2xl font-bold flex items-center gap-1">
                                    <Flame className="h-6 w-6 text-orange-500" />
                                    {streak}
                                </div>
                                <div className="text-xs opacity-90">Day Streak</div>
                            </div>
                            <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-3 min-w-32">
                                <div className="text-2xl font-bold">156</div>
                                <div className="text-xs opacity-90">Points Earned</div>
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
                    {strengths.map((strength, index) => {
                        const meta = getStrengthMeta(index);
                        return (
                            <Card key={index} className="border-2 hover:shadow-lg transition-all cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="text-5xl">{meta.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-[#31326F] mb-1">
                                                {strength.name}
                                            </h3>
                                            <p className="text-sm text-slate-600">Score: {strength.score}% • {meta.desc}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
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
                    <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                        {weekly_activity.map((day, index) => (
                            <div key={index} className="flex-1 text-center min-w-[60px]">
                                <div
                                    className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${day.active
                                        ? "bg-gradient-to-br from-[#A8FBD3] to-[#4FB7B3] shadow-lg scale-105"
                                        : "bg-slate-100"
                                        }`}
                                >
                                    <div className={`text-xl ${day.active ? "animate-bounce" : ""}`}>{day.active ? day.emoji : ""}</div>
                                </div>
                                <div className={`text-sm font-medium mt-2 ${day.active ? "text-[#31326F]" : "text-slate-400"}`}>
                                    {day.day}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full">
                            <Flame className="h-5 w-5" />
                            <span className="font-semibold">{streak} Day Streak - Incredible!</span>
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
                            <Badge className="bg-[#4FB7B3] text-white text-lg px-3 py-1">{mastered_skills.length}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mastered_skills.slice(0, 3).map((skill, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                                    <div className="text-2xl">✅</div>
                                    <div className="flex-1">
                                        <div className="font-medium text-[#31326F]">{skill.name}</div>
                                        <div className="text-sm text-slate-500">{skill.score}% mastery</div>
                                    </div>
                                </div>
                            ))}
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
                            <Badge className="bg-[#637AB9] text-white text-lg px-3 py-1">{growing_skills.length}</Badge>
                        </div>
                        <CardDescription>Practice makes perfect!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {growing_skills.slice(0, 3).map((skill, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-yellow-200">
                                    <div className="text-2xl">🌟</div>
                                    <div className="flex-1">
                                        <div className="font-medium text-[#31326F]">{skill.name}</div>
                                        <div className="text-sm text-slate-500">{skill.score}% - Keep going!</div>
                                    </div>
                                </div>
                            ))}
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
                                <strong>{selectedChild.name}</strong> shows exceptional dedication with a {streak}-day learning streak!
                                Their quick progress in {mastered_skills[0]?.name || "Class"} demonstrates strong problem-solving skills.
                                Consider celebrating this milestone together! 🌟
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
