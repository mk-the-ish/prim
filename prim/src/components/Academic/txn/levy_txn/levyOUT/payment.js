import React, { useState } from 'react';
import LOusd from './usd.js';
import LOzwg from './zwg.js';

function LOpay () {
    const [activeRevenue, setActiveRevenue] = useState('USD'); // Initial state

    const handleRevenueChange = (RevenueType) => {
        setActiveRevenue(RevenueType);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

                {/* Content Area */}
                <div >
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
                    {activeRevenue === 'USD' && <LOusd />}
                    {activeRevenue === 'ZWG' && <LOzwg />}

                </div>
            </div>   
    );
}

export default LOpay;