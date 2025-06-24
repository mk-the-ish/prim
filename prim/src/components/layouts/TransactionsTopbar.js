import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../components/api/userApi';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/button';
import Loader from '../ui/loader';

import ViewInvoices from './../bankTransactions/purchasesInvoices/viewInvoices';
import LIView from './../bankTransactions/cbzTransactions/cbz_in/view';
import LIpay from './../bankTransactions/cbzTransactions/cbz_in/revenue';
import LOView from './../bankTransactions/cbzTransactions/cbz_out/view';
import LOpay from './../bankTransactions/cbzTransactions/cbz_out/payment';
import TIView from './../bankTransactions/zbTransactions/zb_in/view';
import TIpay from './../bankTransactions/zbTransactions/zb_in/revenue';
import TOView from './../bankTransactions/zbTransactions/zb_out/view';
import TOpay from './../bankTransactions/zbTransactions/zb_out/payment';
import ViewPC from '../cashTransactions/pettyCash/viewPC';

const DROPDOWN_Z_INDEX = 50;

const DropdownMenu = ({ show, anchorRef, children }) => {
    if (!show) return null;
    return (
        <div
            className="absolute mt-2 shadow-lg rounded-lg w-44"
            style={{
                zIndex: DROPDOWN_Z_INDEX,
                left: 0,
                top: '100%',
                background: '#fff'
            }}
        >
            {children}
        </div>
    );
};

const SubDropdownMenu = ({ show, children, left = '100%' }) => {
    if (!show) return null;
    return (
        <div
            className="absolute top-0"
            style={{
                left,
                zIndex: DROPDOWN_Z_INDEX + 1,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                borderRadius: '0.5rem',
                minWidth: '10rem'
            }}
        >
            {children}
        </div>
    );
};

// Theme toggle button for topbar
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
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeSubDropdown, setActiveSubDropdown] = useState(null);
    const [activeTxn, setActiveTxn] = useState('CBZ_viewInvoices');
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

    const handleDropdown = (dropdown) => {
        setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
        setActiveSubDropdown(null);
    };

    const handleSubDropdown = (subDropdown) => {
        setActiveSubDropdown((prev) => (prev === subDropdown ? null : subDropdown));
    };

    const handleTxnSelect = (txn) => {
        setActiveTxn(txn);
        setActiveDropdown(null);
        setActiveSubDropdown(null);
    };

    const renderTxn = () => {
        switch (activeTxn) {
            case 'CBZ_viewInvoices':
                return <ViewInvoices />;
            case 'CBZ_Payment':
                return <LOpay />;
            case 'CBZ_Revenue':
                return <LIpay />;
            case 'CBZ_in':
                return <LIView />;
            case 'CBZ_out':
                return <LOView />;
            case 'ZB_viewInvoices':
                return <ViewInvoices />;
            case 'ZB_Payment':
                return <TOpay />;
            case 'ZB_Revenue':
                return <TIpay />;
            case 'ZB_in':
                return <TIView />;
            case 'ZB_out':
                return <TOView />;
            case 'Petty_Cash':
                return <ViewPC />;
            default:
                return <ViewInvoices />;
        }
    };

    // Dropdown menu items
    const cbzMenu = [
        {
            label: 'Payment',
            sub: [
                { id: 'viewInvoices', label: 'Purchases Invoice' },
                { id: 'Payment', label: 'New Payment' }
            ],
            subKey: 'cbzPayment'
        },
        {
            label: 'New Revenue',
            action: () => handleTxnSelect('CBZ_Revenue')
        },
        {
            label: 'View',
            sub: [
                { id: 'in', label: 'Revenues' },
                { id: 'out', label: 'Payments' }
            ],
            subKey: 'cbzView'
        }
    ];

    const zbMenu = [
        {
            label: 'Payment',
            sub: [
                { id: 'viewInvoices', label: 'Purchases Invoice' },
                { id: 'Payment', label: 'New Payment' }
            ],
            subKey: 'zbPayment'
        },
        {
            label: 'New Revenue',
            action: () => handleTxnSelect('ZB_Revenue')
        },
        {
            label: 'View',
            sub: [
                { id: 'in', label: 'Revenues' },
                { id: 'out', label: 'Payments' }
            ],
            subKey: 'zbView'
        }
    ];

    return (
        <div className="min-h-screen" style={{ background: currentTheme.background?.default }}>
            {/* Fixed Header */}
            <div
                className="py-4 px-6 flex items-center justify-between relative"
                style={{
                    background: currentTheme.background?.topbar || '#1f2937',
                    color: currentTheme.text?.primary || '#fff',
                    zIndex: DROPDOWN_Z_INDEX + 10
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
                    {/* CBZ Dropdown */}
                    <div className="relative">
                        <Button
                            onClick={() => handleDropdown('CBZ')}
                            variant={activeDropdown === 'CBZ' ? 'primary' : 'secondary'}
                            className="px-4 py-2 font-bold"
                        >
                            CBZ
                        </Button>
                        <DropdownMenu show={activeDropdown === 'CBZ'}>
                            {cbzMenu.map((item, idx) =>
                                item.sub ? (
                                    <div className="relative" key={item.label}>
                                        <button
                                            onClick={() => handleSubDropdown(item.subKey)}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                            style={{ background: 'transparent' }}
                                        >
                                            {item.label}
                                        </button>
                                        <SubDropdownMenu show={activeSubDropdown === item.subKey}>
                                            {item.sub.map(subItem => (
                                                <button
                                                    key={subItem.id}
                                                    onClick={() => handleTxnSelect(`CBZ_${subItem.id}`)}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    {subItem.label}
                                                </button>
                                            ))}
                                        </SubDropdownMenu>
                                    </div>
                                ) : (
                                    <button
                                        key={item.label}
                                        onClick={item.action}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        {item.label}
                                    </button>
                                )
                            )}
                        </DropdownMenu>
                    </div>
                    {/* ZB Dropdown */}
                    <div className="relative">
                        <Button
                            onClick={() => handleDropdown('ZB')}
                            variant={activeDropdown === 'ZB' ? 'primary' : 'secondary'}
                            className="px-4 py-2 font-bold"
                        >
                            ZB
                        </Button>
                        <DropdownMenu show={activeDropdown === 'ZB'}>
                            {zbMenu.map((item, idx) =>
                                item.sub ? (
                                    <div className="relative" key={item.label}>
                                        <button
                                            onClick={() => handleSubDropdown(item.subKey)}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                            style={{ background: 'transparent' }}
                                        >
                                            {item.label}
                                        </button>
                                        <SubDropdownMenu show={activeSubDropdown === item.subKey}>
                                            {item.sub.map(subItem => (
                                                <button
                                                    key={subItem.id}
                                                    onClick={() => handleTxnSelect(`ZB_${subItem.id}`)}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    {subItem.label}
                                                </button>
                                            ))}
                                        </SubDropdownMenu>
                                    </div>
                                ) : (
                                    <button
                                        key={item.label}
                                        onClick={item.action}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        {item.label}
                                    </button>
                                )
                            )}
                        </DropdownMenu>
                    </div>
                    {/* Petty Cash Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setActiveTxn('Petty_Cash')}
                            className="px-4 py-2 font-bold bg-gray-700 hover:bg-gray-600 rounded"
                        >
                            Petty Cash
                        </button>
                    </div>
                    {/* Theme Toggle Button */}
                    <ThemeToggleButton />
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 p-6 overflow-y-auto" style={{ background: currentTheme.background?.default }}>
                {renderTxn()}
            </div>
        </div>
    );
};

export default Topbar;