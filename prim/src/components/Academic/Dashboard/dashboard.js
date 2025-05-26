import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Pie, Bar } from 'react-chartjs-2';
import { useQuery } from "@tanstack/react-query";
import {
    fetchDashboardUser,
    fetchDashboardStats,
    fetchStudentChartData,
    fetchCashFlowData,
} from '../../api';
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

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const year = new Date().getFullYear();

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['dashboardUser'],
        queryFn: fetchDashboardUser,
        onError: () => navigate('/login'),
        onSuccess: (data) => {
            if (!data || data.role !== 'admin') {
                navigate('/unauthorised');
            }
        }
    });

    // Fetch dashboard statistics
    const { data: statistics = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
        enabled: !!userData?.role
    });

    // Fetch student chart data
    const { data: chartData = {}, isLoading: chartsLoading } = useQuery({
        queryKey: ['studentCharts'],
        queryFn: fetchStudentChartData,
        enabled: !!userData?.role
    });

    // Fetch cash flow data
    const { data: cashFlowData = {}, isLoading: cashFlowLoading } = useQuery({
        queryKey: ['cashFlow', year],
        queryFn: () => fetchCashFlowData(year),
        enabled: !!userData?.role
    });

    const loading = userLoading || statsLoading || chartsLoading || cashFlowLoading;
    const userRole = userData?.role;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    
    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userData?.name || 'Profile'}</span>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">Dashboard</h1>
            </div>
            <div className="p-2">
                {/* Statistics Cards */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-lg shadow-md p-3 bg-blue-200">
                        <div className="flex items-center">
                            <UserGroupIcon className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                                <h3 className="text-xs font-semibold text-gray-600">Total Students</h3>
                                <p className="text-xl font-bold text-gray-900">{statistics.totalStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg shadow-md p-3 bg-red-200">
                        <div className="flex items-center">
                            <ExclamationCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                            <div>
                                <h3 className="text-xs font-semibold text-gray-600">Students Owing</h3>
                                <p className="text-xl font-bold text-gray-900">{statistics.studentsOwing}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg shadow-md p-3 bg-green-200">
                        <div>
                            <div className="flex items-center mb-1">
                                <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-3" />
                                <h3 className="text-xs font-semibold text-gray-600">CBZ Net Revenue</h3>
                            </div>
                            <div className="space-y-0.5 ml-11">
                                <p className="text-sm font-semibold">USD: ${statistics.cbzRevenueUsd?.toFixed(2) || '0.00'}</p>
                                <p className="text-sm font-semibold">ZWG: ${statistics.cbzRevenueZwg?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg shadow-md p-3 bg-purple-200">
                        <div>
                            <div className="flex items-center mb-1">
                                <CurrencyDollarIcon className="h-8 w-8 text-purple-500 mr-3" />
                                <h3 className="text-xs font-semibold text-gray-600">ZB Net Revenue</h3>
                            </div>
                            <div className="space-y-0.5 ml-11">
                                <p className="text-sm font-semibold">USD: ${statistics.zbRevenueUsd?.toFixed(2) || '0.00'}</p>
                                <p className="text-sm font-semibold">ZWG: ${statistics.zbRevenueZwg?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Levy Cash Flow</h2>
                        <div className="h-[300px] relative">
                            <Bar data={cashFlowData.levyCashFlow} options={barChartOptions} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Gender Distribution</h2>
                        <div className="h-[300px] relative">
                            <Pie data={chartData.genderData} options={pieChartOptions} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Grade Distribution</h2>
                        <div className="h-[300px] relative">
                            <Pie data={chartData.gradeData} options={pieChartOptions} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Tuition Cash Flow</h2>
                        <div className="h-[300px] relative">
                            <Bar data={cashFlowData.tuitionCashFlow} options={barChartOptions} />
                        </div>
                    </div>
                </div>

                {/* Action Menu (Floating Button) */}
                {userRole === 'admin' && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <div className="relative">
                            {isMenuOpen && (
                                <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-2 w-48">
                                    {actions.map((action) => (
                                        <button
                                            key={action.name}
                                            onClick={() => {
                                                navigate(action.path);
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
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
                    </div>)}
            </div>
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
    
export default AdminDashboard;
