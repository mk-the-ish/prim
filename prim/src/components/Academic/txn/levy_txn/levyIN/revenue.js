import React, { useState } from 'react';
import LIusd from './usd.js';
import LIzwg from './zwg.js';

function LIpay() {
    const [activePayment, setActivePayment] = useState('USD'); // Initial state

    const handlePaymentChange = (PaymentType) => {
        setActivePayment(PaymentType);
    };

    return (
        <div>
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
    );
}

export default LIpay;