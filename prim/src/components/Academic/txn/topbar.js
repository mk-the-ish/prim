import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const TopBar = () => {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null); // State to track active dropdown
    const [activeSubDropdown, setActiveSubDropdown] = useState(null); // State to track active sub-dropdown

    const toggleDropdown = (dropdown) => {
        setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
        setActiveSubDropdown(null); // Close sub-dropdown when switching main dropdown
    };

    const toggleSubDropdown = (subDropdown) => {
        setActiveSubDropdown((prev) => (prev === subDropdown ? null : subDropdown));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Top Navigation Bar */}
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                
                <h1 className="text-2xl font-bold text-center flex-1">Account Transactions</h1>
                {/* CBZ Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('CBZ')}
                        className="px-4 py-2 font-bold bg-gray-700 hover:bg-gray-600 rounded"
                    >
                        CBZ
                    </button>
                    {activeDropdown === 'CBZ' && (
                        <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                            <button
                                onClick={() => toggleSubDropdown('cbzPayment')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                Payment
                            </button>
                            {activeSubDropdown === 'cbzPayment' && (
                                <div className="absolute top-0 left-full ml-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                                    <button
                                        onClick={() => navigate('/viewInvoices')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Purchases Invoice
                                    </button>
                                    <button
                                        onClick={() => navigate('/levyOUT/payment')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        New Payment
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => navigate('/levyIN/revenue')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                New Revenue
                            </button>
                            <button
                                onClick={() => toggleSubDropdown('cbzView')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                View
                            </button>
                            {activeSubDropdown === 'cbzView' && (
                                <div className="absolute top-0 left-full ml-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                                    <button
                                        onClick={() => navigate('/levyIN')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Revenues
                                    </button>
                                    <button
                                        onClick={() => navigate('/levyOUT')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Payments
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ZB Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('ZB')}
                        className="px-4 py-2 font-bold bg-gray-700 hover:bg-gray-600 rounded"
                    >
                        ZB
                    </button>
                    {activeDropdown === 'ZB' && (
                        <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                            <button
                                onClick={() => toggleSubDropdown('zbPayment')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                Payment
                            </button>
                            {activeSubDropdown === 'zbPayment' && (
                                <div className="absolute top-0 left-full ml-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                                    <button
                                        onClick={() => navigate('/viewinvoices')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Purchases Invoice
                                    </button>
                                    <button
                                        onClick={() => navigate('/tuitionOUT/payment')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        New Payment
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => navigate('/tuitionIN/revenue')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                New Revenue
                            </button>
                            <button
                                onClick={() => toggleSubDropdown('zbView')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                View
                            </button>
                            {activeSubDropdown === 'zbView' && (
                                <div className="absolute top-0 left-full ml-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                                    <button
                                        onClick={() => navigate('/tuitionIN')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Revenues
                                    </button>
                                    <button
                                        onClick={() => navigate('/tuitionOUT')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Payments
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Petty Cash Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('PettyCash')}
                        className="px-4 py-2 font-bold bg-gray-700 hover:bg-gray-600 rounded"
                    >
                        Petty Cash
                    </button>
                    {activeDropdown === 'PettyCash' && (
                        <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                            <button
                                onClick={() => navigate('/pettycash/payment')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                Payment
                            </button>
                            <button
                                onClick={() => navigate('/pettycash/view')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                View
                            </button>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default TopBar;