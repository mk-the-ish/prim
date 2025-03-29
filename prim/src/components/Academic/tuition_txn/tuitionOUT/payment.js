import React, { useState } from 'react';
import TOusd from './usd.js';
import TOzwg from './zwg.js';

function TOpay() {
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
            {activeRevenue === 'USD' && <TOusd />}
            {activeRevenue === 'ZWG' && <TOzwg />}
        </div>
    );
}

export default TOpay;