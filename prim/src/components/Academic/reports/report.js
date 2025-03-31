import React, { useState } from 'react';
import DailyReport from './daily';
import MonthlyReport from './monthly';
import TermlyReport from './termly';
import YearlyReport from './yearly';

const Report = () => {
    const [activeReport, setActiveReport] = useState('daily'); // Default to 'daily'

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
        <div className="flex flex-col h-screen">
            {/* Top Bar */}
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                {/* Centered Heading */}
                <h1 className="text-2xl font-bold text-center flex-1">Reports</h1>

                {/* Navigation Buttons */}
                <div className="flex space-x-4">
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