import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import TuitionUSD from './tuition_usd';
import TuitionZWG from './tuition_zwg';
import TopBar from '../../ui/topbar';
import ContextSwitch from '../../ui/contextSwitch';
import SkeletonLoader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';

function Tuition() {
    const [activeTab, setActiveTab] = useState('USD');
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
            if (!data || !['admin', 'bursar'].includes(data.role)) {
                addToast('You are not authorized to view this page.', 'error');
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
                title="Tuition Payments" 
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
                    {activeTab === 'USD' && <TuitionUSD />}
                    {activeTab === 'ZWG' && <TuitionZWG />}
                </div>
            </div>
        </div>
    );
}

export default Tuition;