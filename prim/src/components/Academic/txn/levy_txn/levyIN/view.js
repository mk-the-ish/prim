import React, { useState } from 'react';
import LIVusd from './viewUSD.js';
import LIVzwg from './viewZWG.js';
import TopBar from '../../topbar.js';

function LIView() {
    const [activeView, setActiveView] = useState('USD'); // Initial state

    const handleViewChange = (ViewType) => {
        setActiveView(ViewType);
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