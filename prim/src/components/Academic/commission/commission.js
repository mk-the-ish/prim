import React, { useState } from 'react';
import CommIN from './commIN';
import CommOUT from './commOUT';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api';

function Commission() {
    const [activeCommission, setActiveCommission] = useState('IN'); // Initial state
    const navigate = useNavigate();

    const { data: userData, isLoading } = useQuery({
            queryKey: ['user'],
            queryFn: fetchUser,
            onError: () => navigate('/login'),
            onSuccess: (data) => {
                if (!data || !['admin', 'bursar'].includes(data.role)) {
                    navigate('/unauthorised');
                }
            }
        });
    
        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            );
        }

    //const handleCommissionChange = (CommissionType) => {
      //  setActiveCommission(CommissionType);
    //};

    return (
        <div className="min-h-screen bg-gray-100">
                    {/* Fixed Header */}
                    <div className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                                <FaUserCircle className="text-lg" />
                                <span className="ml-4">{userData?.name || 'Profile'}</span>
                            </Link>
                </div>
                <h1 className="text-2xl font-bold text-center" style={{ flex: 1, textAlign: 'center' }}>
                    Commission Transactions
                </h1>
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${activeCommission === 'IN'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                        onClick={() => setActiveCommission('IN')}
                    >
                        Commission In
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${activeCommission === 'OUT'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                        onClick={() => setActiveCommission('OUT')}
                    >
                        Commission Out
                    </button>
                </div>
            </div>
            <div className="pt-5 px-6">
                {activeCommission === 'IN' && <CommIN />}
                {activeCommission === 'OUT' && <CommOUT />}
            </div>
            
        </div>
    );
}

export default Commission;