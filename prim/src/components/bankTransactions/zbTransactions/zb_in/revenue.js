import React, { useState } from 'react';
import TIusd from './usd.js';
import TIzwg from './zwg.js';
import { useTheme } from '../../../../contexts/ThemeContext';
import ContextSwitch from '../../../ui/contextSwitch';

function TIpay() {
    const [activePayment, setActivePayment] = useState('USD');
    const { currentTheme } = useTheme();

    return (
        <div className="min-h-screen flex flex-col items-center " style={{ background: currentTheme.background?.default }}>
            <div className="flex mb-8">
                <ContextSwitch
                    activeTab={activePayment}
                    onTabChange={setActivePayment}
                    tabs={['USD', 'ZWG']}
                />
            </div>
            <div className="w-full max-w-md">
                {activePayment === 'USD' && <TIusd />}
                {activePayment === 'ZWG' && <TIzwg />}
            </div>
        </div>
    );
}

export default TIpay;