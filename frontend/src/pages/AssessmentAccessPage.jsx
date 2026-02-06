import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { api } from '../services/api';

const AssessmentAccessPage = () => {
    const navigate = useNavigate();
    const [serialNumber, setSerialNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await api.studentAccess(serialNumber);
            // Redirect to assessment start page (using a query param for now or a dedicated route)
            // For this task, we'll redirect to a content page or a basic "Welcome Student" page
            // The user request said "access to assessment".
            // Since we don't have a specific assessment start page yet for this flow,
            // we will redirect to /practice page as a placeholder, or maybe the student dashboard?
            // Let's create a simple "AssessmentStart" page logic or just redirect to /practice.
            // Ideally, the serial number links to a specific assessment, but for now it's just login.
            navigate('/assessment-student-dashboard');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Access failed. Please check your serial number.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Student Assessment Login
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your unique serial number to begin
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-blue-900/5 sm:rounded-xl sm:px-10 border border-white/50">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                                Serial Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="serialNumber"
                                    name="serialNumber"
                                    type="text"
                                    required
                                    value={serialNumber}
                                    onChange={(e) => setSerialNumber(e.target.value)}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                                    placeholder="Enter your serial number"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                                <p className="text-sm font-medium text-red-800 text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Start Assessment
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssessmentAccessPage;
