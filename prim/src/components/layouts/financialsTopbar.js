import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api/userApi.js';
import CSLevy from './../financials/Cashbooks/levy/levy.js';
import CSTuition from './../financials/Cashbooks/tuition/tuition.js';
import ViewInvoices from '../bankTransactions/purchasesInvoices/viewInvoices.js';
import Budget from './../financials/Budget/budget.js';
import HR from './../financials/HR/HR.js';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/button';
import Loader from '../ui/loader';

const ThemeToggleButton = () => {
    const { themeName, toggleTheme, currentTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="flex items-center px-3 py-2 rounded transition-colors duration-200 ml-4"
            style={{
                background: currentTheme.background?.paper || '#374151',
                color: currentTheme.text?.primary || '#fff',
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

const Financials = () => {
    const [activeFinancial, setActiveFinancial] = useState('CSLevy');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { currentTheme } = useTheme();

    const renderFinancial = () => {
        switch (activeFinancial) {
            case 'Levy':
                return <CSLevy />;
            case 'Tuition':
                return <CSTuition />;
            case 'Invoices':
                return <ViewInvoices />;
            case 'Budget':
                return <Budget />;
            case 'HR':
                return <HR />;
            default:
                return <CSLevy />;
        }
    };

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login')
    });

    if (loading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background?.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    const navButtons = [
        { key: 'Levy', label: 'Levy Cashbook' },
        { key: 'Tuition', label: 'Tuition Cashbook' },
        { key: 'Invoices', label: 'Invoices' },
        { key: 'Budget', label: 'Budget' },
        { key: 'HR', label: 'HR' },
    ];

    return (
        <div className="flex flex-col h-screen">
            {/* Top Bar */}
            <div
                className="py-4 px-6 flex justify-between items-center overflow-visible z-20 relative"
                style={{
                    background: currentTheme.background?.topbar || '#1f2937',
                    color: currentTheme.text?.primary || '#fff',
                }}
            >
                <Link to="/profile" className="flex items-center hover:opacity-80 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userData?.name || 'Profile'}</span>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">Financial Statements</h1>
                {/* Navigation Buttons */}
                <div className="flex space-x-4 relative items-center">
                    {navButtons.map(btn => (
                        <Button
                            key={btn.key}
                            onClick={() => setActiveFinancial(btn.key)}
                            variant={activeFinancial === btn.key ? 'primary' : 'secondary'}
                            className="px-4 py-2 font-bold"
                            style={{
                                background: activeFinancial === btn.key
                                    ? currentTheme.primary?.main || '#2563eb'
                                    : currentTheme.background?.paper || '#374151',
                                color: activeFinancial === btn.key
                                    ? currentTheme.primary?.contrastText || '#fff'
                                    : currentTheme.text?.primary || '#fff',
                                border: `1px solid ${currentTheme.divider || '#374151'}`
                            }}
                        >
                            {btn.label}
                        </Button>
                    ))}
                    <ThemeToggleButton />
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto" style={{ background: currentTheme.background?.default }}>
                {renderFinancial()}
            </div>
        </div>
    );
};

export default Financials;