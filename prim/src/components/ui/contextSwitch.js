import React from 'react';

const ContextSwitch = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="flex space-x-2">
            {tabs.map(tab => (
                <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        activeTab === tab
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default ContextSwitch;
