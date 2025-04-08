import React, { useState } from 'react';
import CSLusd from './levyUSD';
import CSLzwg from './levyZWG';


function CSLevy() {
    const [activeTab, setActiveTab] = useState('USD');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="text-2xl font-bold mb-4" style={{ flex: 1, textAlign: 'center' }}>Levy Cashbooks</h2>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'USD' ? 'lightblue' : 'lightgray',
                    }}
                    onClick={() => handleTabChange('USD')}
                >
                    USD
                </button>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'ZWG' ? 'lightblue' : 'lightgray',
                    }}
                    onClick={() => handleTabChange('ZWG')}
                >
                    ZWG
                </button>
            </div>
            {activeTab === 'USD' && <CSLusd />}
            {activeTab === 'ZWG' && <CSLzwg />}
        </>
    );
};

export default CSLevy;