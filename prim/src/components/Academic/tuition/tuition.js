import React, { useState } from 'react';
import TuitionUSD from './tuition_usd';
import TuitionZWG from './tuition_zwg';


function Tuition() {
    const [activeTab, setActiveTab] = useState('USD');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2 className="text-2xl font-semibold mb-4" style={{ flex: 1, textAlign: 'center' }}>Tuition Payments</h2>
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
            { activeTab === 'USD' && <TuitionUSD /> }
            {activeTab === 'ZWG' && <TuitionZWG />}
        </>
    );
};

export default Tuition;