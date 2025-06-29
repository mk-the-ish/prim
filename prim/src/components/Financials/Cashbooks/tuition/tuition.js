import React, { useState } from 'react';
import CSTusd from './usd';
import CSTzwg from './zwg';
import ContextSwitch from '../../../ui/contextSwitch';
import { useTheme } from '../../../../contexts/ThemeContext';

function CSTuition() {
    const [activeTab, setActiveTab] = useState('USD');
    const { currentTheme } = useTheme();

    return (
        <div style={{ background: currentTheme.background?.default, minHeight: '100vh', padding: 24 }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center flex-1">Tuition Payments</h2>
                <ContextSwitch
                    options={['USD', 'ZWG']}
                    value={activeTab}
                    onChange={setActiveTab}
                    theme={currentTheme}
                />
            </div>
            {activeTab === 'USD' && <CSTusd />}
            {activeTab === 'ZWG' && <CSTzwg />}
        </div>
    );
}

export default CSTuition;