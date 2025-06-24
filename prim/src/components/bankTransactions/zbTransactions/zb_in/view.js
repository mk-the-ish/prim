import React, { useState } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import TIVusd from './viewUSD.js';
import TIVzwg from './viewZWG.js';
import ContextSwitch from '../../../ui/contextSwitch';

function TIView() {
    const [activeView, setActiveView] = useState('USD');
    const { currentTheme } = useTheme();

    return (
        <div className="min-h-screen" style={{ background: currentTheme.background?.default }}>
            <div className="flex justify-center mb-8">
                <ContextSwitch
                    activeTab={activeView}
                    onTabChange={setActiveView}
                    tabs={['USD', 'ZWG']}
                />
            </div>
            <div className="w-full max-w-2xl mx-auto">
                {activeView === 'USD' && <TIVusd />}
                {activeView === 'ZWG' && <TIVzwg />}
            </div>
        </div>
    );
}

export default TIView;