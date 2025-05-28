import React, { useState } from 'react';
import TIVusd from './viewUSD.js';
import TIVzwg from './viewZWG.js';

function TIView() {
    const [activeView, setActiveView] = useState('USD'); // Initial state

    const handleViewChange = (ViewType) => {
        setActiveView(ViewType);
    };

    return (
        <div className="min-h-screen">

                {/* Content Area */}
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
                    {activeView === 'USD' && <TIVusd />}
                    {activeView === 'ZWG' && <TIVzwg />}

                </div>
            </div>
        
            
    );
}

export default TIView;