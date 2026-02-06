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
import { Download, Mail, Printer, FileText } from "lucide-react";
import { api } from "@/services/api";

export default function ReportsPage() {
    const { selectedChild } = useOutletContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedChild?.student_id) return;
            setLoading(true);
            try {
                const res = await api.getParentReportSummary(selectedChild?.student_id);
                setData(res);
            } catch (err) {
                console.error("Failed to load reports summary:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedChild]);

    if (!selectedChild) return null;
    if (loading || !data) return <div className="p-12 text-center animate-pulse text-slate-500">Loading Report...</div>;

    const { period, total_quizzes, avg_accuracy, improvement, streak, skills_mastered, top_performances, areas_to_improve } = data;

    return (
        <div className="space-y-8 max-w-5xl pb-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#31326F] flex items-center gap-3">
                        <span className="text-4xl">📋</span>
                        Progress Report
                    </h1>
                    <p className="text-slate-600 mt-2">
                        Complete overview of {selectedChild.name}'s learning
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button className="gap-2 bg-[#4FB7B3] hover:bg-[#4FB7B3]/90 text-white">
                        <Download className="h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Report Period */}
            <Card className="border-2 bg-gradient-to-br from-[#A8FBD3] to-[#4FB7B3]">
                <CardContent className="p-8">
                    <div className="text-center">
                        <div className="text-5xl mb-4">📊</div>
                        <h2 className="text-3xl font-bold text-[#31326F] mb-2">
                            {period} Report
                        </h2>
                        <p className="text-[#31326F]/80 text-lg">
                            For {selectedChild.name} • {selectedChild.grade}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics Summary */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="text-[#31326F]">Key Metrics</CardTitle>
                    <CardDescription>Overview of this month's performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                            <div className="text-4xl mb-2">🎯</div>
                            <div className="text-3xl font-bold text-[#31326F]">
                                {avg_accuracy}%
                            </div>
                            <div className="text-sm text-slate-600 mt-1">Avg Accuracy</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                            <div className="text-4xl mb-2">📚</div>
                            <div className="text-3xl font-bold text-[#31326F]">
                                {total_quizzes}
                            </div>
                            <div className="text-sm text-slate-600 mt-1">Quizzes Done</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50">
                            <div className="text-4xl mb-2">🔥</div>
                            <div className="text-3xl font-bold text-[#31326F]">
                                {streak}
                            </div>
                            <div className="text-sm text-slate-600 mt-1">Day Streak</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                            <div className="text-4xl mb-2">⭐</div>
                            <div className="text-3xl font-bold text-[#31326F]">
                                {skills_mastered}
                            </div>
                            <div className="text-sm text-slate-600 mt-1">Skills Mastered</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top Performances */}
            <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#31326F]">
                        <span className="text-2xl">🏆</span>
                        Top Performances
                    </CardTitle>
                    <CardDescription>Skills where {selectedChild.name} excels!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {top_performances.length === 0 ? <p className="text-slate-500 italic">No top performances yet.</p> : null}
                        {top_performances.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-green-200"
                            >
                                <div className="text-5xl">🥇</div>
                                <div className="flex-1">
                                    <div className="font-semibold text-lg text-[#31326F]">
                                        {item.name}
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-green-600">
                                    {item.score}%
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Areas to Improve */}
            <Card className="border-2 border-[#637AB9]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#31326F]">
                        <span className="text-2xl">🌱</span>
                        Growth Opportunities
                    </CardTitle>
                    <CardDescription>Skills that need a little more practice</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {areas_to_improve.length === 0 ? <p className="text-slate-500 italic">No specific areas to improve found yet.</p> : null}
                        {areas_to_improve.map((item, index) => (
                            <div
                                key={index}
                                className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200"
                            >
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="flex-1">
                                        <div className="font-semibold text-lg text-[#31326F] mb-1">
                                            {item.name}
                                        </div>
                                        <Badge className="bg-[#637AB9] text-white">
                                            {item.score}% - Growing!
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-blue-200">
                                        <strong>💡 Tip:</strong> Practice makes perfect! Try visualizing this concept.
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Overall Assessment */}
            <Card className="border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                        <div className="text-7xl">🎉</div>
                        <div>
                            <h3 className="font-bold text-2xl text-[#31326F] mb-4">
                                Overall Assessment
                            </h3>
                            <div className="space-y-3 text-slate-700 leading-relaxed">
                                <p>
                                    <strong>{selectedChild.name}</strong> is doing great!
                                    With an average accuracy of <strong>{avg_accuracy}%</strong> and a{" "}
                                    <strong>{streak}-day learning streak</strong>, they're demonstrating excellent
                                    dedication.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Share Options */}
            <Card className="border-2">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg text-[#31326F] mb-1">
                                Share this report
                            </h3>
                            <p className="text-sm text-slate-600">
                                Email to teachers or save for your records
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </Button>
                            <Button className="gap-2 bg-[#4FB7B3] hover:bg-[#4FB7B3]/90 text-white">
                                <FileText className="h-4 w-4" />
                                Save PDF
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
