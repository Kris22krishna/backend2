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
import { api } from "@/services/api";

export default function ProgressPage() {
    const { selectedChild } = useOutletContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedChild?.student_id) return;
            setLoading(true);
            try {
                const res = await api.getParentProgress(selectedChild?.student_id);
                setData(res);
            } catch (err) {
                console.error("Failed to load progress:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedChild]);

    if (!selectedChild) return null;
    if (loading || !data) return <div className="p-12 text-center animate-pulse text-slate-500">Loading progress...</div>;

    const { improvement_pct, streak, current_accuracy, total_points, weekly_progress, milestones } = data;

    return (
        <div className="space-y-8 max-w-5xl pb-8 animate-fade-in">
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
                        <div className="text-3xl font-bold text-[#31326F]">+{improvement_pct}%</div>
                        <div className="text-sm text-slate-600 mt-1">Improvement</div>
                    </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-orange-100 to-red-50">
                    <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Flame className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="text-3xl font-bold text-[#31326F]">{streak}</div>
                        <div className="text-sm text-slate-600 mt-1">Day Streak</div>
                    </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-[#A8FBD3] to-[#4FB7B3]/30">
                    <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Target className="h-6 w-6 text-[#4FB7B3]" />
                        </div>
                        <div className="text-3xl font-bold text-[#31326F]">{current_accuracy}%</div>
                        <div className="text-sm text-slate-600 mt-1">Current</div>
                    </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-purple-100 to-pink-50">
                    <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Star className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-3xl font-bold text-[#31326F]">{total_points}</div>
                        <div className="text-sm text-slate-600 mt-1">Total Points</div>
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
                            +{improvement_pct}% This Month 🎉
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={weekly_progress}
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
                            Started at <strong className="text-[#31326F]">{weekly_progress[0]?.accuracy || 0}%</strong> and now at{" "}
                            <strong className="text-[#4FB7B3]">{current_accuracy}%</strong> - That's amazing growth! 🌟
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
                                <strong>{selectedChild.name}</strong> has improved by <strong>{improvement_pct}% this month</strong> -
                                that's outstanding! The consistent {streak}-day streak shows real dedication to learning.
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
