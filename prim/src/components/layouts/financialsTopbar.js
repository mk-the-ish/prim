import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api/userApi.js';
import CSLevy from './../financials/Cashbooks/levy/levy.js';
import CSTuition from './../financials/Cashbooks/tuition/tuition.js';
import Statements from './../financials/Statements/statements.js';
import Budget from './../financials/Budget/budget.js';
import HR from './../financials/HR/HR.js';

const Financials = () => {
    const [activeFinancial, setActiveFinancial] = useState('CSLevy');
    const [showDropdown, setShowDropdown] = useState(false); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const renderFinancial = () => {
        switch (activeFinancial) {
            case 'Levy':
                return <CSLevy />;
            case 'Tuition':
                return <CSTuition />;
            case 'Statements':
                return <Statements />;
            case 'Budget':
                return <Budget />;
            case 'HR':
                return <HR />;
            default:
                return <CSLevy />;
        }
    };

    const { data: userData, isLoading: userLoading } = useQuery({
                queryKey: ['user'],
                queryFn: fetchUser,
                onError: () => navigate('/login')
        });
        
        if (loading || userLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading Financials...</p>
                    </div>
                </div>
            );
        }

    return (
        <div className="flex flex-col h-screen">
            {/* Top Bar */}
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userData?.name || 'Profile'}</span>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">Financial Statements</h1>

                {/* Navigation Buttons */}
                <div className="flex space-x-4 relative">
                    {/* Cashbooks Button with Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown visibility on click
                            className="px-4 py-2 text-white font-bold bg-gray-600 hover:bg-gray-700 rounded"
                        >
                            Cashbooks
                        </button>
                        {showDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                                <button
                                    onClick={() => {
                                        setActiveFinancial('Tuition');
                                        setShowDropdown(false); // Close dropdown after selection
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                >
                                    Tuition
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveFinancial('Levy');
                                        setShowDropdown(false); // Close dropdown after selection
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                >
                                    Levy
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Other Buttons */}
                    <button
                        onClick={() => setActiveFinancial('Statements')}
                        className={`px-4 py-2 rounded ${activeFinancial === 'Statements' ? 'bg-blue-500 text-white' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        Statements
                    </button>
                    <button
                        onClick={() => setActiveFinancial('Budget')}
                        className={`px-4 py-2 rounded ${activeFinancial === 'Budget' ? 'bg-blue-500 text-white' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        Budget
                    </button>
                    <button
                        onClick={() => setActiveFinancial('HR')}
                        className={`px-4 py-2 rounded ${activeFinancial === 'HR' ? 'bg-blue-500 text-white' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        HR
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">{renderFinancial()}</div>
        </div>
    );
};

export default Financials;