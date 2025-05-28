import React, { useState } from 'react';
import LIVusd from './viewUSD.js';
import LIVzwg from './viewZWG.js';

function LIView() {
    const [activeView, setActiveView] = useState('USD'); // Initial state

    const handleViewChange = (ViewType) => {
        setActiveView(ViewType);
    };

    return (
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* Content Area */}
                <div className="overflow-y-auto">
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
                    {activeView === 'USD' && <LIVusd />}
                    {activeView === 'ZWG' && <LIVzwg />}
                
                    </div>
            </div>

            
    );
}

export default LIView;