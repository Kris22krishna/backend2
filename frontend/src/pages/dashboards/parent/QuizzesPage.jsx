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
import { Calendar, Trophy, TrendingUp, Star } from "lucide-react";
import { api } from "@/services/api";

export default function QuizzesPage() {
    const { selectedChild } = useOutletContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedChild?.student_id) return;
            setLoading(true);
            try {
                const res = await api.getParentQuizzes(selectedChild?.student_id);
                setData(res);
            } catch (err) {
                console.error("Failed to load quizzes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedChild]);

    if (!selectedChild) return null;
    if (loading || !data) return <div className="p-12 text-center animate-pulse text-slate-500">Loading quizzes...</div>;

    const { total_quizzes, avg_score, streak, avg_time_mins, weekly_activity, recent_quizzes } = data;

    return (
        <div className="space-y-8 max-w-5xl pb-8 animate-fade-in">
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
                        <div className="text-3xl font-bold text-[#31326F]">{total_quizzes}</div>
                        <div className="text-sm text-slate-600">Quizzes</div>
                    </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-[#4FB7B3]/20 to-white">
                    <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-2">🎯</div>
                        <div className="text-3xl font-bold text-[#31326F]">{avg_score}%</div>
                        <div className="text-sm text-slate-600">Avg Score</div>
                    </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-[#637AB9]/20 to-white">
                    <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-2">🔥</div>
                        <div className="text-3xl font-bold text-[#31326F]">{streak}</div>
                        <div className="text-sm text-slate-600">Day Streak</div>
                    </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-purple-200/30 to-white">
                    <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-2">⚡</div>
                        <div className="text-3xl font-bold text-[#31326F]">{avg_time_mins}m</div>
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
                    <div className="grid grid-cols-7 gap-3">
                        {weekly_activity.slice(0, 7).map((day, index) => (
                            <div key={index} className="flex-1 text-center">
                                <div
                                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${day.active
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
                        <strong>{total_quizzes} quizzes</strong> completed total - Amazing! 🌟
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
                    {recent_quizzes.length === 0 ? (
                        <div className="text-slate-500 italic p-4 text-center border-2 border-dashed rounded-xl">No quizzes taken yet.</div>
                    ) : (
                        recent_quizzes.map((quiz) => (
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
                                                className={`text-4xl font-bold ${quiz.score >= 80
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
                        )))}
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
                                The {streak}-day streak shows amazing dedication. Consider a small reward to celebrate this milestone! 🌟
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
