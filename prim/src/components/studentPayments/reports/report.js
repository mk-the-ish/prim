import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import DailyReport from './daily';
import MonthlyReport from './monthly';
import TermlyReport from './termly';
import YearlyReport from './yearly';
import TopBar from '../../ui/topbar';
import Loader from '../../ui/loader';
import Button from '../../ui/button';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';

const Report = () => {
    const [activeReport, setActiveReport] = useState('daily'); // Default to 'daily'
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
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: currentTheme.background?.default }}
            >
                <Loader type="card" count={1} />
            </div>
        );
    }

    const renderReport = () => {
        switch (activeReport) {
            case 'daily':
                return <DailyReport />;
            case 'monthly':
                return <MonthlyReport />;
            case 'termly':
                return <TermlyReport />;
            case 'yearly':
                return <YearlyReport />;
            default:
                return <DailyReport />;
        }
    };

    return (
        <div
            className="min-h-screen"
            style={{
                background: currentTheme.background?.default,
                color: currentTheme.text?.primary
            }}
        >
            <TopBar title="Reports" userName={userData?.name} />
            <div className="px-6 py-8">
                <div className="flex space-x-2 mb-6">
                    <Button
                        variant={activeReport === 'daily' ? 'primary' : 'secondary'}
                        onClick={() => setActiveReport('daily')}
                    >
                        Daily
                    </Button>
                    <Button
                        variant={activeReport === 'monthly' ? 'primary' : 'secondary'}
                        onClick={() => setActiveReport('monthly')}
                    >
                        Monthly
                    </Button>
                    <Button
                        variant={activeReport === 'termly' ? 'primary' : 'secondary'}
                        onClick={() => setActiveReport('termly')}
                    >
                        Termly
                    </Button>
                    <Button
                        variant={activeReport === 'yearly' ? 'primary' : 'secondary'}
                        onClick={() => setActiveReport('yearly')}
                    >
                        Yearly
                    </Button>
                </div>
                <div
                >
                    {renderReport()}
                </div>
            </div>
        </div>
    );
};

export default Report;