import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from 'react-chartjs-2';
import { useQuery } from "@tanstack/react-query";
import {
    fetchDashboardStats,
    fetchStudentChartData,
    fetchCashFlowData,
} from '../../components/api/dashboardApi';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import {
    UserGroupIcon,
    ExclamationCircleIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/solid';
import { PlusIcon } from '@heroicons/react/24/solid';
import { fetchUser } from "../api/userApi";
import SummaryCard from '../ui/summaryCard';
import Loader from '../ui/loader';
import TopBar from '../ui/topbar';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const defaultChartData = {
    genderData: {
        labels: ['Male', 'Female'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB80', '#FF638480']
        }]
    },
    gradeData: {
        labels: ['Grade 1'],
        datasets: [{
            data: [0],
            backgroundColor: ['#FF6384'],
            hoverBackgroundColor: ['#FF638480']
        }]
    }
};

const defaultCashFlowData = {
    levyCashFlow: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            { label: 'Levy IN', data: Array(12).fill(0), backgroundColor: '#36A2EB' },
            { label: 'Levy OUT', data: Array(12).fill(0), backgroundColor: '#FF6384' }
        ]
    },
    tuitionCashFlow: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            { label: 'Tuition IN', data: Array(12).fill(0), backgroundColor: '#4BC0C0' },
            { label: 'Tuition OUT', data: Array(12).fill(0), backgroundColor: '#FFCE56' }
        ]
    }
};

// Reusable Chart Container
const ChartContainer = ({ title, children, className = '' }) => {
    const { currentTheme } = useTheme();
    return (
        <div
            className={`rounded-lg shadow-md p-6 ${className}`}
            style={{
                background: currentTheme.background.paper,
                color: currentTheme.text.primary
            }}
        >
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="h-[300px] relative">{children}</div>
        </div>
    );
};

const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
};

const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: (value) => `$${value.toLocaleString()}`
            }
        }
    },
    plugins: {
        legend: {
            position: 'top'
        },
        tooltip: {
            callbacks: {
                label: (context) => `$${context.raw.toLocaleString()}`
            }
        }
    }
};

const actions = [
    { icon: '📄', name: 'Bulk Invoicing', path: '/bulk-invoicing' },
    { icon: '🔄', name: 'New Term', path: '/new-term' },
    { icon: '📅', name: 'New Year', path: '/new-year' }
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const year = new Date().getFullYear();
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => fetchUser(['admin']),
        retry: false,
        onError: (error) => {
            if (error.message.includes('Not authenticated')) {
                addToast('You are not authenticated. Please login.', 'error');
                navigate('/login');
            } else if (error.message.includes('Unauthorized')) {
                addToast('You are not authorized to view this page.', 'error');
                navigate('/unauthorised');
            } else {
                addToast('Failed to fetch user data.', 'error');
            }
        }
    });

    const { data: statistics = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
        enabled: !!userData?.role && userData.role === 'admin',
        onError: () => addToast('Failed to fetch dashboard statistics.', 'error')
    });

    const { data: chartData = defaultChartData, isLoading: chartsLoading } = useQuery({
        queryKey: ['studentCharts'],
        queryFn: fetchStudentChartData,
        enabled: !!userData?.role && userData.role === 'admin',
        onError: () => addToast('Failed to fetch student chart data.', 'error')
    });

    const { data: cashFlowData = defaultCashFlowData, isLoading: cashFlowLoading } = useQuery({
        queryKey: ['cashFlow', year],
        queryFn: () => fetchCashFlowData(year),
        enabled: !!userData?.role && userData.role === 'admin',
        onError: () => addToast('Failed to fetch cash flow data.', 'error')
    });

    const loading = userLoading || statsLoading || chartsLoading || cashFlowLoading;
    const userRole = userData?.role;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    return (
        <div
            className="p-6 min-h-screen relative"
            style={{ background: currentTheme.background.default, color: currentTheme.text.primary }}
        >
            <TopBar title="Dashboard" userName={userData?.name} />
            <div className="p-2">
                {/* Statistics Cards */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                        title="Total Students"
                        icon={<UserGroupIcon className="text-blue-500" />}
                        bgColor="bg-blue-200"
                    >
                        <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                            {statistics.totalStudents}
                        </p>
                    </SummaryCard>

                    <SummaryCard
                        title="Students Owing"
                        icon={<ExclamationCircleIcon className="text-red-500" />}
                        bgColor="bg-red-200"
                    >
                        <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                            {statistics.studentsOwing}
                        </p>
                    </SummaryCard>

                    <SummaryCard
                        title="CBZ Net Revenue"
                        icon={<CurrencyDollarIcon className="text-green-500" />}
                        bgColor="bg-green-200"
                    >
                        <div className="space-y-0.5">
                            <p className="text-sm font-semibold" style={{ color: currentTheme.text.primary }}>
                                USD: ${statistics.cbzRevenueUsd?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-sm font-semibold" style={{ color: currentTheme.text.primary }}>
                                ZWG: ${statistics.cbzRevenueZwg?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                    </SummaryCard>

                    <SummaryCard
                        title="ZB Net Revenue"
                        icon={<CurrencyDollarIcon className="text-purple-500" />}
                        bgColor="bg-purple-200"
                    >
                        <div className="space-y-0.5">
                            <p className="text-sm font-semibold" style={{ color: currentTheme.text.primary }}>
                                USD: ${statistics.zbRevenueUsd?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-sm font-semibold" style={{ color: currentTheme.text.primary }}>
                                ZWG: ${statistics.zbRevenueZwg?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                    </SummaryCard>
                </div>

                {/* Charts Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <ChartContainer title="Levy Cash Flow">
                        <Bar data={cashFlowData.levyCashFlow} options={barChartOptions} />
                    </ChartContainer>
                    <ChartContainer title="Gender Distribution">
                        <Pie data={chartData.genderData} options={pieChartOptions} />
                    </ChartContainer>
                    <ChartContainer title="Grade Distribution">
                        <Pie data={chartData.gradeData} options={pieChartOptions} />
                    </ChartContainer>
                    <ChartContainer title="Tuition Cash Flow">
                        <Bar data={cashFlowData.tuitionCashFlow} options={barChartOptions} />
                    </ChartContainer>
                </div>

                {/* Action Menu (Floating Button) */}
                {userRole === 'admin' && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <div className="relative">
                            {isMenuOpen && (
                                <div
                                    className="absolute bottom-16 right-0 rounded-lg shadow-lg p-2 w-48"
                                    style={{
                                        background: currentTheme.background.paper,
                                        color: currentTheme.text.primary
                                    }}
                                >
                                    {actions.map((action) => (
                                        <button
                                            key={action.name}
                                            onClick={() => {
                                                navigate(action.path);
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 rounded"
                                            style={{
                                                background: 'none',
                                                color: currentTheme.text.primary
                                            }}
                                        >
                                            <span className="mr-2">{action.icon}</span>
                                            <span>{action.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center"
                            >
                                <PlusIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;