import React, { useState } from 'react';
import CSLevy from './Cashbooks/levy/levy.js';
import CSTuition from './Cashbooks/tuition/tuition.js';
import Statements from './Statements/statements.js';
import Budget from './Budget/budget.js';
import HR from './HR/HR.js';
import PreviousCS from './Cashbooks/previousCS.js';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Financials = () => {
    const [activeFinancial, setActiveFinancial] = useState('CSLevy'); // Default to 'Cashbooks'
    const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility

    const renderFinancial = () => {
        switch (activeFinancial) {
            case 'Levy':
                return <CSLevy />;
            case 'Tuition':
                return <CSTuition />;
            case 'Previous':
                return <PreviousCS />;
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

    return (
        <div className="flex flex-col h-screen">
            {/* Top Bar */}
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <div>
                    <Link to="/students
                    
                    " className="flex items-center">
                        <FaHome className="text-xl" />
                    </Link>
                </div>
                {/* Centered Heading */}
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
                                <button
                                    onClick={() => {
                                        setActiveFinancial('Previous');
                                        setShowDropdown(false); // Close dropdown after selection
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                >
                                    Previous Cashbooks
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