import React from 'react';
import { useNavigate } from 'react-router-dom';

const LevyTxn = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">CBZ Transactions</h1>
            <div className="grid grid-cols-2 gap-6">
                {/* New Payments Card */}
                <div
                    onClick={() => navigate('/l-payment')}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                    <h2 className="text-xl font-semibold mb-2">New Payments</h2>
                    <p className="text-gray-500 text-sm text-center">Add new payment transactions.</p>
                </div>

                {/* New Revenues Card */}
                <div
                    onClick={() => navigate('/l-revenue')}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                    <h2 className="text-xl font-semibold mb-2">New Revenues</h2>
                    <p className="text-gray-500 text-sm text-center">Add new revenue transactions.</p>
                </div>

                {/* View Payments Card */}
                <div
                    onClick={() => navigate('/li-view')}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                    <h2 className="text-xl font-semibold mb-2">View Payments</h2>
                    <p className="text-gray-500 text-sm text-center">View all payment transactions.</p>
                </div>

                {/* View Revenues Card */}
                <div
                    onClick={() => navigate('/lo-view')}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                    <h2 className="text-xl font-semibold mb-2">View Revenues</h2>
                    <p className="text-gray-500 text-sm text-center">View all revenue transactions.</p>
                </div>
            </div>
        </div>
    );
};

export default LevyTxn;