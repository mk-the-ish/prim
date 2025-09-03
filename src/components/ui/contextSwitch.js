import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ContextSwitch = ({ activeTab, onTabChange, tabs = [], options, value, onChange }) => {
    const { currentTheme } = useTheme();
    // Support both legacy (tabs/activeTab/onTabChange) and new (options/value/onChange) API
    const items = options || tabs || [];
    const selected = value !== undefined ? value : activeTab;
    const handleChange = onChange || onTabChange;

    return (
        <div className="inline-flex">
            {items.map((item, idx) => {
                const label = typeof item === 'string' ? item : item.label;
                const val = typeof item === 'string' ? item : item.value;
                return (
                    <button
                        key={val}
                        className={`px-4 py-2 transition-colors duration-200 font-medium
                            ${idx === 0 ? 'rounded-l-lg' : ''}
                            ${idx === items.length - 1 ? 'rounded-r-lg' : ''}
                            ${idx !== 0 ? '-ml-px' : ''}
                        `}
                        style={{
                            background: selected === val
                                ? currentTheme.primary?.main || '#2563eb'
                                : currentTheme.background?.paper || '#f3f4f6',
                            color: selected === val
                                ? currentTheme.primary?.contrastText || '#fff'
                                : currentTheme.text?.secondary || '#6b7280',
                            border: `1px solid ${currentTheme.divider || '#d1d5db'}`,
                            zIndex: selected === val ? 2 : 1,
                            position: 'relative'
                        }}
                        onClick={() => handleChange(val)}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

export default ContextSwitch;
