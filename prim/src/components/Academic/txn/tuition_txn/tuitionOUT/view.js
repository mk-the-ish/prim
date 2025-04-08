import React, { useState } from 'react';
import TOVusd from './viewUSD.js';
import TOVzwg from './viewZWG.js';

function TOView() {
    const [activeView, setActiveView] = useState('USD'); // Initial state

    const handleViewChange = (ViewType) => {
        setActiveView(ViewType);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeView === 'USD' ? 'lightblue' : 'lightgray',
                    }}
                    onClick={() => handleViewChange('USD')}
                >
                    USD
                </button>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeView === 'ZWG' ? 'lightblue' : 'lightgray',
                    }}
                    onClick={() => handleViewChange('ZWG')}
                >
                    ZWG
                </button>
            </div>
            {activeView === 'USD' && <TOVusd />}
            {activeView === 'ZWG' && <TOVzwg />}
        </div>
    );
}

export default TOView;