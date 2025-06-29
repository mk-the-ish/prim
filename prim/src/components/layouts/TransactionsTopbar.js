import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../components/api/userApi';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/button';
import Loader from '../ui/loader';

import CBZView from './../bankTransactions/cbzTransactions/cbz_in/view';
import ZBView from './../bankTransactions/zbTransactions/zb_in/view';
import ViewPC from '../cashTransactions/pettyCash/viewPC';

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

const Topbar = () => {
    const [activeView, setActiveView] = useState('CBZ');
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    const { data: userData, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => {
            addToast('Authentication required. Please login.', 'error');
            navigate('/login');
        },
        onSuccess: (data) => {
            if (!data || !['admin', 'bursar', 'viewer'].includes(data.role)) {
                addToast('You are not authorized to view this page.', 'error');
                navigate('/unauthorised');
            }
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background?.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    const renderView = () => {
        switch (activeView) {
            case 'CBZ':
                return <CBZView />;
            case 'ZB':
                return <ZBView />;
            case 'Petty_Cash':
                return <ViewPC />;
            default:
                return <CBZView />;
        }
    };

    return (
        <div className="min-h-screen" style={{ background: currentTheme.background?.default }}>
            {/* Fixed Header */}
            <div
                className="py-4 px-6 flex items-center justify-between relative"
                style={{
                    background: currentTheme.background?.topbar || '#1f2937',
                    color: currentTheme.text?.primary || '#fff',
                    zIndex: 60
                }}
            >
                <div className="flex items-center min-w-[120px]">
                    <Link to="/profile" className="flex items-center hover:opacity-80 transition-colors duration-200">
                        <FaUserCircle className="text-lg" />
                        <span className="ml-4">{userData?.name || 'Profile'}</span>
                    </Link>
                </div>
                <h1 className="text-2xl font-bold text-center flex-1">Account Transactions</h1>
                <div className="flex space-x-4 relative items-center">
                    <Button
                        onClick={() => setActiveView('CBZ')}
                        variant={activeView === 'CBZ' ? 'primary' : 'secondary'}
                        className="px-4 py-2 font-bold"
                    >
                        CBZ
                    </Button>
                    <Button
                        onClick={() => setActiveView('ZB')}
                        variant={activeView === 'ZB' ? 'primary' : 'secondary'}
                        className="px-4 py-2 font-bold"
                    >
                        ZB
                    </Button>
                    <Button
                        onClick={() => setActiveView('Petty_Cash')}
                        variant={activeView === 'Petty_Cash' ? 'primary' : 'secondary'}
                        className="px-4 py-2 font-bold"
                    >
                        Petty Cash
                    </Button>
                    <ThemeToggleButton />
                </div>
            </div>
            {/* Scrollable Content Area */}
            <div className="flex-1 p-6 overflow-y-auto" style={{ background: currentTheme.background?.default }}>
                {renderView()}
            </div>
        </div>
    );
};

export default Topbar;