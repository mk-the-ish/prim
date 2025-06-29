import React, { useState } from 'react';
import CommIN from './commIN';
import CommOUT from './commOUT';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import TopBar from '../../ui/topbar';
import Loader from '../../ui/loader';
import ContextSwitch from '../../ui/contextSwitch';
import { useTheme } from '../../../contexts/ThemeContext';

function Commission() {
    const [activeCommission, setActiveCommission] = useState('IN');
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
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background?.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: currentTheme.background?.default }}>
            <TopBar title="Commission Transactions" userName={userData?.name} />
            <div className="flex justify-end px-6 pt-6">
                <ContextSwitch
                    activeTab={activeCommission}
                    onTabChange={setActiveCommission}
                    tabs={['IN', 'OUT']}
                />
            </div>
            <div className="pt-5 px-6">
                {activeCommission === 'IN' && <CommIN />}
                {activeCommission === 'OUT' && <CommOUT />}
            </div>
        </div>
    );
}

export default Commission;