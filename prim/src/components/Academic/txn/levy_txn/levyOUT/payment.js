import React, { useState } from 'react';
import LOusd from './usd.js';
import LOzwg from './zwg.js';

function LOpay () {
    const [activeRevenue, setActiveRevenue] = useState('USD'); // Initial state

    const handleRevenueChange = (RevenueType) => {
        setActiveRevenue(RevenueType);
    };

    return (
        <div>
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
    );
}

export default LOpay;