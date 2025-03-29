import React, { useState } from 'react';
import TIusd from './usd.js';
import TIzwg from './zwg.js';

function TIpay() {
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
            {activePayment === 'USD' && <TIusd />}
            {activePayment === 'ZWG' && <TIzwg />}
        </div>
    );
}

export default TIpay;