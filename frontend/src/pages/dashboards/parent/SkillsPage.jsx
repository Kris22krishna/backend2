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
import { Progress } from "@/components/ui/progress";
import { Sparkles, Target, TrendingUp } from "lucide-react";
import { api } from "@/services/api";

export default function SkillsPage() {
    const { selectedChild } = useOutletContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedChild?.student_id) return;
            setLoading(true);
            try {
                const res = await api.getParentSkills(selectedChild?.student_id);
                setData(res);
            } catch (err) {
                console.error("Failed to load skills:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedChild]);

    if (!selectedChild) return null;
    if (loading || !data) return <div className="p-12 text-center animate-pulse text-slate-500">Loading skills...</div>;

    const { summary, mastered_skills, growing_skills, need_practice_skills } = data;

    return (
        <div className="space-y-8 max-w-5xl pb-8 animate-fade-in">
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
                        <div className="text-4xl font-bold text-[#31326F] mb-1">{summary.mastered_count}</div>
                        <div className="text-sm text-slate-600">Skills Mastered</div>
                    </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-[#A8FBD3] to-[#4FB7B3]/30">
                    <CardContent className="p-6 text-center">
                        <div className="text-5xl mb-3">🌱</div>
                        <div className="text-4xl font-bold text-[#31326F] mb-1">{summary.improving_count}</div>
                        <div className="text-sm text-slate-600">Skills Improving</div>
                    </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-yellow-100 to-orange-50">
                    <CardContent className="p-6 text-center">
                        <div className="text-5xl mb-3">🎯</div>
                        <div className="text-4xl font-bold text-[#31326F] mb-1">{summary.need_practice_count}</div>
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
                        These skills are absolutely crushing it! 90%+ accuracy
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        {mastered_skills.length === 0 ? <p className="text-slate-500 italic">No mastered skills yet. Keep practicing!</p> : null}
                        {mastered_skills.map((skill, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200"
                            >
                                <div className="text-5xl">🥇</div>
                                <div className="flex-1">
                                    <div className="font-semibold text-lg text-[#31326F]">
                                        {skill.name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className="bg-green-600 text-white">
                                            Mastered!
                                        </Badge>
                                        <span className="text-sm text-slate-600">
                                            {skill.score}% accuracy
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
                        {growing_skills.length === 0 && need_practice_skills.length === 0 ? <p className="text-slate-500 italic">No skills in progress.</p> : null}

                        {/* Improving */}
                        {growing_skills.map((skill, index) => (
                            <div key={`imp-${index}`} className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">🌟</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-semibold text-lg text-[#31326F]">
                                                {skill.name}
                                            </div>
                                            <div className="text-2xl font-bold text-[#637AB9]">
                                                {skill.score}%
                                            </div>
                                        </div>
                                        <Progress value={skill.score} className="h-3" />
                                        <div className="text-sm text-slate-600 mt-1">
                                            Almost there! Keep going! 💪
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Need Practice */}
                        {need_practice_skills.map((skill, index) => (
                            <div key={`need-${index}`} className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">💪</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-semibold text-lg text-[#31326F]">
                                                {skill.name}
                                            </div>
                                            <div className="text-2xl font-bold text-orange-500">
                                                {skill.score}%
                                            </div>
                                        </div>
                                        <Progress value={skill.score} className="h-3 bg-slate-100" indicatorClassName="bg-orange-500" />
                                        <div className="text-sm text-slate-600 mt-1">
                                            Let's practice this more!
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
                                <strong>{selectedChild.name}</strong> has mastered <strong>{summary.mastered_count} skills</strong>!
                                That's incredible dedication and hard work.
                                Keep encouraging practice! 🍕📚
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
