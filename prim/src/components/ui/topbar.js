import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

// Reusable theme toggle button for topbar
const ThemeToggleButton = () => {
    const { themeName, toggleTheme, currentTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="flex items-center px-3 py-2 rounded transition-colors duration-200 ml-4"
            style={{
                background: currentTheme.background?.paper || '#374151',
                color: currentTheme.text?.primary || '#ffffff',
                border: `1px solid ${currentTheme.divider || '#374151'}`
            }}
            title={themeName === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            <span className="text-lg">
                {themeName === 'light' ? <FaMoon /> : <FaSun />}
            </span>
        </button>
    );
};

const TopBar = ({ title, userName }) => {
    const { currentTheme } = useTheme();
    return (
        <div
            className="py-4 px-6 flex items-center justify-between relative"
            style={{
                background: currentTheme.background?.paper || '#1f2937',
                color: currentTheme.text?.primary || '#fff'
            }}
        >
            <div className="flex items-center min-w-[120px]">
                <Link to="/profile" className="flex items-center hover:opacity-80 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userName || 'Profile'}</span>
                </Link>
            </div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-2xl font-bold text-center">{title}</h1>
            </div>
            <div className="flex items-center min-w-[120px] justify-end">
                <ThemeToggleButton />
            </div>
        </div>
    );
};

export default TopBar;
