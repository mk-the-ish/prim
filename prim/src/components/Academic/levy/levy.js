import React, { useState } from 'react';
import LevyUSD from './levy_usd';
import LevyZWG from './levy_zwg';

const Levy = () => {
    const [activeTab, setActiveTab] = useState('USD');

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Levy Payments</h2>

            {/* Segmented Navigation */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setActiveTab('USD')}
                    className={`px-4 py-2 font-bold rounded-lg ${activeTab === 'USD' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    USD Payments
                </button>
                <button
                    onClick={() => setActiveTab('ZWG')}
                    className={`px-4 py-2 font-bold rounded-lg ml-4 ${activeTab === 'ZWG' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    ZWG Payments
                </button>
            </div>

            {/* Render Active Tab */}
            {activeTab === 'USD' && <LevyUSD />}
            {activeTab === 'ZWG' && <LevyZWG />}
        </div>
    );
};

export default Levy;