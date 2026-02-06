import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from '../../../services/api';

export default function LinkChildDialog({ isOpen, onClose, onLinkSuccess }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!isOpen) return null;

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
                onClose();
                setUsername('');
                setSuccess(null);
            }, 1500);
        } catch (err) {
            console.error("Link child error:", err);
            setError(err.response?.data?.detail || "Failed to link child. Please check the username.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-200">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 text-slate-500 hover:text-slate-700"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>

                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-50 rounded-full">
                            <UserPlus className="h-6 w-6 text-teal-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-[#31326F]">Add Another Child</CardTitle>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="child-username">Student Username</Label>
                            <Input
                                id="child-username"
                                placeholder="Enter their username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border-slate-300 focus:border-teal-500"
                                required
                            />
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

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-[#4FB7B3] hover:bg-[#3da19d] text-white"
                                disabled={loading || success}
                            >
                                {loading ? "Linking..." : "Link Child"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
