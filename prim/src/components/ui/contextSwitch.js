import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ContextSwitch = ({ activeTab, onTabChange, tabs }) => {
    const { currentTheme } = useTheme();

    return (
        <div className="inline-flex">
            {tabs.map((tab, idx) => (
                <button
                    key={tab}
                    className={`px-4 py-2 transition-colors duration-200 font-medium
                        ${idx === 0 ? 'rounded-l-lg' : ''}
                        ${idx === tabs.length - 1 ? 'rounded-r-lg' : ''}
                        ${idx !== 0 ? '-ml-px' : ''}
                        ${activeTab === tab
                            ? ''
                            : ''}
                    `}
                    style={{
                        background: activeTab === tab
                            ? currentTheme.primary?.main || '#2563eb'
                            : currentTheme.background?.paper || '#f3f4f6',
                        color: activeTab === tab
                            ? currentTheme.primary?.contrastText || '#fff'
                            : currentTheme.text?.secondary || '#6b7280',
                        border: `1px solid ${currentTheme.divider || '#d1d5db'}`,
                        zIndex: activeTab === tab ? 2 : 1,
                        position: 'relative'
                    }}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default ContextSwitch;
