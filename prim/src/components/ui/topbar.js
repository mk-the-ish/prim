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
            className="py-2 px-2 sm:py-4 sm:px-6 flex flex-wrap items-center justify-between relative w-full"
            style={{
                background: currentTheme.background?.paper || '#1f2937',
                color: currentTheme.text?.primary || '#fff',
                borderBottom: `1px solid ${currentTheme.divider}`
            }}
        >
            <div className="flex items-center min-w-[100px] w-1/3 sm:w-auto">
                <Link to="/profile" className="flex items-center hover:opacity-80 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-2 sm:ml-4 text-sm sm:text-base">{userName || 'Profile'}</span>
                </Link>
            </div>
            <div className="w-full sm:w-auto flex justify-center absolute left-0 right-0 top-1/2 -translate-y-1/2 sm:static sm:transform-none">
                <h1 className="text-lg sm:text-2xl font-bold text-center truncate">{title}</h1>
            </div>
            <div className="flex items-center min-w-[100px] w-1/3 sm:w-auto justify-end">
                <ThemeToggleButton />
            </div>
        </div>
    );
};

export default TopBar;
