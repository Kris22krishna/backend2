import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, LogOut, FileText, CheckCircle, Clock } from 'lucide-react';
import { api } from '../../services/api';
import logo from '../../assets/logo.jpg';

const AssessmentStudentDashboard = () => {
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState('Student');
    const [studentDetails, setStudentDetails] = useState({ grade: '', school: '' });

    useEffect(() => {
        const name = localStorage.getItem('studentName');
        const grade = localStorage.getItem('studentGrade');
        const school = localStorage.getItem('studentSchool');

        if (name) {
            setStudentName(name);
            setStudentDetails({ grade: grade || '', school: school || '' });
        } else {
            // Fallback or redirect if no session
            // navigate('/assessment-access'); 
        }
    }, [navigate]);

    const handleStartAssessment = async () => {
        try {
            const data = await api.startAssessment();
            if (data && data.questions) {
                navigate('/assessment-runner', { state: data });
            }
        } catch (error) {
            console.error(error);
            alert("Failed to start assessment: " + error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentName');
        navigate('/assessment-access');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Skill100.AI Logo" className="h-10 w-10 rounded-full object-cover" />
                        <span className="font-bold text-gray-900 text-xl">Skill100.AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">{studentName}</span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                            <LogOut className="h-4 w-4" />
                            Exit
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
                        <h1 className="text-3xl font-bold mb-2">Welcome, {studentName}!</h1>
                        <p className="text-blue-100 mb-4">You are logged in and ready to take your assessment.</p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                            <span className="bg-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                                🎓 Grade {studentDetails.grade}
                            </span>
                            <span className="bg-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                                🏫 {studentDetails.school}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-blue-50/50 rounded-xl p-6 border border-blue-100 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">General Assessment</h3>
                                    <p className="text-gray-500 text-sm mb-2">Duration: 45 Minutes</p>
                                    <div className="flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded w-fit">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                        Ready to Start
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartAssessment}
                                className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <Play className="h-5 w-5 fill-current" />
                                Start Now
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Instructions</h3>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                <li className="flex gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                    Ensure you have a stable internet connection.
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                    Do not refresh the page during the assessment.
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                    Click "Submit" once you have answered all questions.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AssessmentStudentDashboard;
