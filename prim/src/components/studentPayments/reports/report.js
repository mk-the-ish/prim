import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api';
import DailyReport from './daily';
import MonthlyReport from './monthly';
import TermlyReport from './termly';
import YearlyReport from './yearly';

const Report = () => {
    const [activeReport, setActiveReport] = useState('daily'); // Default to 'daily'
    const navigate = useNavigate();

    const { data: userData, isLoading } = useQuery({
            queryKey: ['user'],
            queryFn: fetchUser,
            onError: () => navigate('/login'),
            onSuccess: (data) => {
                if (!data || !['admin', 'bursar', 'viewer'].includes(data.role)) {
                    navigate('/unauthorised');
                }
            }
    });
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const renderReport = () => {
        switch (activeReport) {
            case 'daily':
                return <DailyReport />;
            case 'monthly':
                return <MonthlyReport />;
            case 'termly':
                return <TermlyReport />;
            case 'yearly':
                return <YearlyReport />;
            default:
                return <DailyReport />;
        }
    };

    return (
                <div className="min-h-screen bg-gray-100">
                    {/* Fixed Header */}
                    <div className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                                <FaUserCircle className="text-lg" />
                                <span className="ml-4">{userData?.name || 'Profile'}</span>
                            </Link>
                        </div>
        
                        <h1 className="text-2xl font-bold text-center flex-1">Reports</h1>
        
                <div className="flex space-x-2">
                    <button
                        onClick={() => setActiveReport('daily')}
                        className={`px-4 py-2 rounded ${activeReport === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setActiveReport('monthly')}
                        className={`px-4 py-2 rounded ${activeReport === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setActiveReport('termly')}
                        className={`px-4 py-2 rounded ${activeReport === 'termly' ? 'bg-blue-500 text-white' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        Termly
                    </button>
                    <button
                        onClick={() => setActiveReport('yearly')}
                        className={`px-4 py-2 rounded ${activeReport === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">{renderReport()}</div>
        </div>
    );
};

export default Report;