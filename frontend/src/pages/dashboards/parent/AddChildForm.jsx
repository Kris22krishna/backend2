import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from '../../../services/api';

export default function AddChildForm({ onLinkSuccess, onDemoMode }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await api.linkChild(username);
            setSuccess(`Successfully linked ${data.student_name}!`);
            setTimeout(() => {
                onLinkSuccess();
            }, 1500);
        } catch (err) {
            console.error("Link child error:", err);
            setError(err.response?.data?.detail || "Failed to link child. Please check the username.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-2 border-[#A8FBD3] shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="h-8 w-8 text-teal-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-[#31326F]">Welcome, Parent!</CardTitle>
                    <CardDescription className="text-lg">
                        Let's connect you to your child's learning journey.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Student Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter student username (e.g. student123)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-12 border-slate-300"
                                required
                            />
                            <p className="text-xs text-slate-500">
                                Usually the same username they use to log in.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                {success}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg bg-[#4FB7B3] hover:bg-[#3da19d] text-white"
                            disabled={loading || success}
                        >
                            {loading ? "Linking..." : "Link Child Account"}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Or</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={onDemoMode}
                        >
                            View Demo Dashboard
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
