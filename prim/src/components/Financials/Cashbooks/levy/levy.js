import React, { useState } from 'react';
import CSLusd from './levyUSD';
import CSLzwg from './levyZWG';
import { useTheme } from '../../../../contexts/ThemeContext';
import ContextSwitch from '../../../ui/contextSwitch';


function CSLevy() {
    const [activeTab, setActiveTab] = useState('USD');
    const { currentTheme } = useTheme();

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold mb-4 flex-1 text-center">Levy Cashbooks</h2>
                <ContextSwitch
                    options={[
                        { value: 'USD', label: 'USD' },
                        { value: 'ZWG', label: 'ZWG' },
                    ]}
                    value={activeTab}
                    onChange={setActiveTab}
                    className="ml-4"
                    style={{
                        background: currentTheme.background?.paper || '#f3f4f6',
                        color: currentTheme.text?.primary || '#111827',
                        border: `1px solid ${currentTheme.divider || '#e5e7eb'}`
                    }}
                />
            </div>
            {activeTab === 'USD' && <CSLusd />}
            {activeTab === 'ZWG' && <CSLzwg />}
        </>
    );
};

export default CSLevy;