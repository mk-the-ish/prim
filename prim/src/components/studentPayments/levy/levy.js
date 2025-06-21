import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import LevyUSD from './levy_usd';
import LevyZWG from './levy_zwg';
import TopBar from '../../ui/topbar';
import ContextSwitch from '../../ui/contextSwitch';
import SkeletonLoader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';

function Levy() {
    const [activeTab, setActiveTab] = useState('USD');
    const navigate = useNavigate();
    const { currentTheme } = useTheme();

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
        return <SkeletonLoader type="card" />;
    }

    return (
        <div
            className="min-h-screen"
            style={{ background: currentTheme.background.default }}
        >
            <TopBar 
                title="Levy Payments" 
                userName={userData?.name} 
            />
            
            <div className="px-6">
                <div className="flex justify-end mt-4">
                    <ContextSwitch
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        tabs={['USD', 'ZWG']}
                    />
                </div>

                <div className="mt-4">
                    {activeTab === 'USD' && <LevyUSD />}
                    {activeTab === 'ZWG' && <LevyZWG />}
                </div>
            </div>
        </div>
    );
}

export default Levy;