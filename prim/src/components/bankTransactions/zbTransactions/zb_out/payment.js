import React, { useState } from 'react';
import TOusd from './usd.js';
import TOzwg from './zwg.js';
import { useTheme } from '../../../../contexts/ThemeContext';
import ContextSwitch from '../../../ui/contextSwitch';

function TOpay() {
    const [activeRevenue, setActiveRevenue] = useState('USD');
    const { currentTheme } = useTheme();

    return (
        <div className="min-h-screen" style={{ background: currentTheme.background?.default }}>
            <div className="flex justify-center mb-8 mt-8">
                <ContextSwitch
                    activeTab={activeRevenue}
                    onTabChange={setActiveRevenue}
                    tabs={['USD', 'ZWG']}
                />
            </div>
            <div className="w-full max-w-md mx-auto">
                {activeRevenue === 'USD' && <TOusd />}
                {activeRevenue === 'ZWG' && <TOzwg />}
            </div>
        </div>
    );
}

export default TOpay;