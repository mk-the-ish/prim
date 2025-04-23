import React, { useState } from 'react';
import TOusd from './usd.js';
import TOzwg from './zwg.js';
import TopBar from '../../topbar.js';

function TOpay() {
    const [activeRevenue, setActiveRevenue] = useState('USD'); // Initial state

    const handleRevenueChange = (RevenueType) => {
        setActiveRevenue(RevenueType);
    };

    return (
            <div className="flex flex-col h-screen">
                {/* Fixed Top Bar */}
                <div className="fixed top-0 left-0 right-0 z-50">
                    <TopBar />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto mt-[80px] p-6 bg-gray-100">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <button
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeRevenue === 'USD' ? 'lightblue' : 'lightgray',
                            }}
                            onClick={() => handleRevenueChange('USD')}
                        >
                            USD
                        </button>
                        <button
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeRevenue === 'ZWG' ? 'lightblue' : 'lightgray',
                            }}
                            onClick={() => handleRevenueChange('ZWG')}
                        >
                            ZWG
                        </button>
                    </div>
                    {activeRevenue === 'USD' && <TOusd />}
                    {activeRevenue === 'ZWG' && <TOzwg />}
                </div>
            </div>
    );
}

export default TOpay;