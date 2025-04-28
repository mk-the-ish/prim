import React, { useState } from 'react';
import LIusd from './usd.js';
import LIzwg from './zwg.js';

function LIpay() {
    const [activePayment, setActivePayment] = useState('USD'); // Initial state

    const handlePaymentChange = (PaymentType) => {
        setActivePayment(PaymentType);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
                {/* Content Area */}
                <div className="overflow-y-auto">
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
                    {activePayment === 'USD' && <LIusd />}
                    {activePayment === 'ZWG' && <LIzwg />}
                </div>
            </div>
        
    );
}

export default LIpay;