import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import ViewInvoices from './invoices/viewInvoices';
import LIView from './levy_txn/levyIN/view';
import LIpay from './levy_txn/levyIN/revenue';
import LOView from './levy_txn/levyOUT/view';
import LOpay from './levy_txn/levyOUT/payment';
import TIView from './tuition_txn/tuitionIN/view';
import TIpay from './tuition_txn/tuitionIN/revenue';
import TOView from './tuition_txn/tuitionOUT/view';
import TOpay from './tuition_txn/tuitionOUT/payment';

const TopBar = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeSubDropdown, setActiveSubDropdown] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSubDropdown, setShowSubDropdown] = useState(false);
    const [activeTxn, setActiveTxn] = useState('CBZ_viewInvoices');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        fetchUserName();
    }, []);

    const fetchUserName = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('user_roles')
                    .select('name')
                    .eq('id', user.id)
                    .maybeSingle();

                if (error) throw error;
                setUserName(data.name);
            }
        } catch (error) {
            console.error('Error fetching user name:', error.message);
        }
    };

    const toggleDropdown = (dropdown) => {
        setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
        setActiveSubDropdown(null);
    };

    const toggleSubDropdown = (subDropdown) => {
        setActiveSubDropdown((prev) => (prev === subDropdown ? null : subDropdown));
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
            default:
                return <ViewInvoices />;
        }
    };

    const renderSubMenu = (items, parentDropdown) => (
        <div className="absolute top-0 right-full mr-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                        setActiveTxn(`${parentDropdown}_${item.id}`);
                        setShowDropdown(false)
                        setShowSubDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                    {item.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="h-screen flex flex-col">
            {/* Fixed Top Navigation Bar */}
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userName || 'Profile'}</span>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">Account Transactions</h1>

                <div className="flex space-x-4 relative">
                    {/* CBZ Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                toggleDropdown('CBZ');
                                setShowDropdown(true);
                                
                            }}
                            className="px-4 py-2 font-bold bg-gray-700 hover:bg-gray-600 rounded"
                        >
                            CBZ
                        </button>
                        {showDropdown && activeDropdown === 'CBZ' && (
                            <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            toggleSubDropdown('cbzPayment');
                                            setShowSubDropdown(true);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Payment
                                    </button>
                                    {showSubDropdown && activeSubDropdown === 'cbzPayment' &&
                                        renderSubMenu([
                                            { id: 'viewInvoices', label: 'Purchases Invoice' },
                                            { id: 'Payment', label: 'New Payment' }
                                        ], 'CBZ')}
                                </div>
                                <button
                                    onClick={() => {
                                        setActiveTxn('CBZ_Revenue');
                                        setShowDropdown(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                >
                                    New Revenue
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            toggleSubDropdown('cbzView')
                                            setShowSubDropdown(true)
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        View
                                    </button>
                                    {showSubDropdown && activeSubDropdown === 'cbzView' &&
                                        renderSubMenu([
                                            { id: 'in', label: 'Revenues' },
                                            { id: 'out', label: 'Payments' }
                                        ], 'CBZ')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ZB Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                toggleDropdown('ZB');
                                setShowDropdown(true)
                            }}
                            className="px-4 py-2 font-bold bg-gray-700 hover:bg-gray-600 rounded"
                        >
                            ZB
                        </button>
                        {showDropdown && activeDropdown === 'ZB' && (
                            <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            toggleSubDropdown('zbPayment');
                                            setShowSubDropdown(true)
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Payment
                                    </button>
                                    {showSubDropdown && activeSubDropdown === 'zbPayment' &&
                                        renderSubMenu([
                                            { id: 'viewInvoices', label: 'Purchases Invoice' },
                                            { id: 'Payment', label: 'New Payment' }
                                        ], 'ZB')}
                                </div>
                                <button
                                    onClick={() => {
                                        setActiveTxn('ZB_Revenue');
                                        setShowDropdown(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                >
                                    New Revenue
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            toggleSubDropdown('zbView');
                                            setShowSubDropdown(true)
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        View
                                    </button>
                                    {showSubDropdown && activeSubDropdown === 'zbView' &&
                                        renderSubMenu([
                                            { id: 'in', label: 'Revenues' },
                                            { id: 'out', label: 'Payments' }
                                        ], 'ZB')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Petty Cash Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('PettyCash')}
                            className="px-4 py-2 font-bold bg-gray-700 hover:bg-gray-600 rounded"
                        >
                            Petty Cash
                        </button>
                        {activeDropdown === 'PettyCash' && (
                            <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg w-40">
                                <button
                                    onClick={() => setActiveTxn('pettyCashPayment')}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                >
                                    Payment
                                </button>
                                <button
                                    onClick={() => setActiveTxn('pettyCashView')}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                >
                                    View
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                    {renderTxn()}
            </div>
        </div>
    );
};

export default TopBar;