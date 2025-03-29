import React, { useState } from 'react';
import CommIN from './commIN';
import CommOUT from './commOUT';

function Commission() {
    const [activeCommission, setActiveCommission] = useState('IN'); // Initial state

    const handleCommissionChange = (CommissionType) => {
        setActiveCommission(CommissionType);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeCommission === 'IN' ? 'lightblue' : 'lightgray',
                    }}
                    onClick={() => handleCommissionChange('IN')}
                >
                    Commission In
                </button>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeCommission === 'OUT' ? 'lightblue' : 'lightgray',
                    }}
                    onClick={() => handleCommissionChange('OUT')}
                >
                    Commission Out
                </button>
            </div>
            {activeCommission === 'IN' && <CommIN />}
            {activeCommission === 'OUT' && <CommOUT />}
        </div>
    );
}

export default Commission;