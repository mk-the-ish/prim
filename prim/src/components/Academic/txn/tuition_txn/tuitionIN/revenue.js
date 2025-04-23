import React, { useState } from 'react';
import TIusd from './usd.js';
import TIzwg from './zwg.js';
import TopBar from '../../topbar.js';

function TIpay() {
    const [activePayment, setActivePayment] = useState('USD'); // Initial state

    const handlePaymentChange = (PaymentType) => {
        setActivePayment(PaymentType);
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
                                backgroundColor: activePayment === 'USD' ? 'lightblue' : 'lightgray',
                            }}
                            onClick={() => handlePaymentChange('USD')}
                        >
                            USD
                        </button>
                        <button
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activePayment === 'ZWG' ? 'lightblue' : 'lightgray',
                            }}
                            onClick={() => handlePaymentChange('ZWG')}
                        >
                            ZWG
                        </button>
                    </div>
                    {activePayment === 'USD' && <TIusd />}
                    {activePayment === 'ZWG' && <TIzwg />}
                </div>
            </div>
        
    );
}

export default TIpay;