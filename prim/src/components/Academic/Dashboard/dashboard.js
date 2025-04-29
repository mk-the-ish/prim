import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from 'react-chartjs-2';
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
//import { Button } from '@/components/ui/button'; // Assuming you have Shadcn Button
import supabase from '../../../SupaBaseConfig';

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
    const [statistics, setStatistics] = useState({
        totalStudents: 0,
        studentsOwing: 0,
        cbzRevenueUsd: 0,
        cbzRevenueZwg: 0,
        zbRevenueUsd: 0,
        zbRevenueZwg: 0,
    });
    const [genderData, setGenderData] = useState({
        labels: ['Male', 'Female'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB80', '#FF638480']
        }]
    });

    const [gradeData, setGradeData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                '#9966FF', '#FF9F40', '#FF6384', '#4BC0C0'
            ],
            hoverBackgroundColor: [
                '#FF638480', '#36A2EB80', '#FFCE5680', '#4BC0C080',
                '#9966FF80', '#FF9F4080', '#FF638480', '#4BC0C080'
            ]
        }]
    });

    const [levyCashFlow, setLevyCashFlow] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Levy IN',
                data: Array(12).fill(0),
                backgroundColor: '#36A2EB'
            },
            {
                label: 'Levy OUT',
                data: Array(12).fill(0),
                backgroundColor: '#FF6384'
            }
        ]
    });
    const [tuitionCashFlow, setTuitionCashFlow] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Tuition IN',
                data: Array(12).fill(0),
                backgroundColor: '#4BC0C0'
            },
            {
                label: 'Tuition OUT',
                data: Array(12).fill(0),
                backgroundColor: '#FFCE56'
            }
        ]
    });

    useEffect(() => {
        // eslint-disable-next-line
        fetchDashboardData();
        // eslint-disable-next-line
    }, []);

    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true)


    const fetchCashFlowData = async (year) => {
        try {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const levyInAmounts = Array(12).fill(0);
            const levyOutAmounts = Array(12).fill(0);
            const tuitionInAmounts = Array(12).fill(0);
            const tuitionOutAmounts = Array(12).fill(0);

            // Fetch all transactions for the year
            const [levyInData, levyOutData, tuitionInData, tuitionOutData] = await Promise.all([
                supabase
                    .from('levy_in_txn_usd')
                    .select('Amount, Date')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`),
                supabase
                    .from('levy_out_txn_usd')
                    .select('Amount, Date')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`),
                supabase
                    .from('tuition_in_txn_usd')
                    .select('Amount, Date')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`),
                supabase
                    .from('tuition_out_txn_usd')
                    .select('Amount, Date')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`)
            ]);

            // Process transactions with error handling
            const processTransactions = (transactions, amountArray) => {
                if (transactions?.data) {
                    transactions.data.forEach(txn => {
                        const month = new Date(txn.Date).getMonth();
                        amountArray[month] += Number(txn.Amount) || 0;
                    });
                }
            };

            processTransactions(levyInData, levyInAmounts);
            processTransactions(levyOutData, levyOutAmounts);
            processTransactions(tuitionInData, tuitionInAmounts);
            processTransactions(tuitionOutData, tuitionOutAmounts);

            setLevyCashFlow({
                labels: months,
                datasets: [
                    { label: 'Levy IN', data: levyInAmounts, backgroundColor: '#36A2EB' },
                    { label: 'Levy OUT', data: levyOutAmounts, backgroundColor: '#FF6384' }
                ]
            });

            setTuitionCashFlow({
                labels: months,
                datasets: [
                    { label: 'Tuition IN', data: tuitionInAmounts, backgroundColor: '#4BC0C0' },
                    { label: 'Tuition OUT', data: tuitionOutAmounts, backgroundColor: '#FFCE56' }
                ]
            });
        } catch (error) {
            console.error('Error fetching cash flow data:', error);
        }
    };

    const fetchStudentDataForCharts = async () => {
        try {
            // Fetch all student data in a single query
            const { data: students, error } = await supabase
                .from('Students')
                .select('Gender, Grade');

            if (error) throw error;

            // Initialize counters
            const genderCounts = { Male: 0, Female: 0 };
            const gradeCounts = {};

            // Process student data
            students?.forEach(student => {
                if (student.Gender) {
                    genderCounts[student.Gender]++;
                }
                if (student.Grade) {
                    gradeCounts[student.Grade] = (gradeCounts[student.Grade] || 0) + 1;
                }
            });

            // Update charts
            setGenderData(prev => ({
                ...prev,
                datasets: [{
                    ...prev.datasets[0],
                    data: [genderCounts.Male, genderCounts.Female]
                }]
            }));

            // Replace the setGradeData section with:
            setGradeData(prev => ({
                labels: Object.keys(gradeCounts).sort(),
                datasets: [{
                    ...prev.datasets[0],
                    data: Object.values(gradeCounts)
                }]
            }));

        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };


    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch total students
            const { count: totalStudents } = await supabase
                .from('Students')
                .select('*', { count: 'exact' });

            // Fetch students owing
            const { count: studentsOwing } = await supabase
                .from('Students')
                .select('*', { count: 'exact' })
                .or('Levy_Owing.gt.0,Tuition_Owing.gt.0')
                .eq('Sponsor', 'self');

            // Fetch CBZ revenue for current year
            const year = new Date().getFullYear();
            const [cbzInUsdRes, cbzInZwgRes, cbzOutUsdRes, cbzOutZwgRes] = await Promise.all([
                supabase
                    .from('levy_in_txn_usd')
                    .select('Amount')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`),
                supabase
                    .from('levy_in_txn_zwg')
                    .select('Amount')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`),
                supabase
                    .from('levy_out_txn_usd')
                    .select('Amount')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`),
                supabase
                    .from('levy_out_txn_zwg')
                    .select('Amount')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`)
            ]);

            // Calculate CBZ revenue
            const cbzRevenueUsd = cbzInUsdRes.data.reduce((sum, txn) => sum + Number(txn.Amount), 0) -
                cbzOutUsdRes.data.reduce((sum, txn) => sum + Number(txn.Amount), 0);

            const cbzRevenueZwg = cbzInZwgRes.data.reduce((sum, txn) => sum + Number(txn.Amount), 0) -
                cbzOutZwgRes.data.reduce((sum, txn) => sum + Number(txn.Amount), 0);

            // Use Promise.all to fetch all ZB data at once
            const [zbInUsdRes, zbInZwgRes, zbOutUsdRes, zbOutZwgRes] = await Promise.all([
                supabase
                    .from('tuition_in_txn_usd')
                    .select('Amount')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`),
                supabase
                    .from('tuition_in_txn_zwg')
                    .select('Amount')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`),
                supabase
                    .from('tuition_out_txn_usd')
                    .select('Amount')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`),
                supabase
                    .from('tuition_out_txn_zwg')
                    .select('Amount')
                    .gte('Date', `${year}-01-01`)
                    .lte('Date', `${year}-12-31`)
            ]);

            // Calculate ZB revenue
            const zbRevenueUsd = zbInUsdRes.data.reduce((sum, txn) => sum + Number(txn.Amount), 0) -
                zbOutUsdRes.data.reduce((sum, txn) => sum + Number(txn.Amount), 0);

            const zbRevenueZwg = zbInZwgRes.data.reduce((sum, txn) => sum + Number(txn.Amount), 0) -
                zbOutZwgRes.data.reduce((sum, txn) => sum + Number(txn.Amount), 0);

            // Add debug logs
            console.log('CBZ Revenue USD:', {
                in: cbzInUsdRes.data,
                out: cbzOutUsdRes.data,
                total: cbzRevenueUsd
            });
            console.log('CBZ Revenue ZWG:', {
                in: cbzInZwgRes.data,
                out: cbzOutZwgRes.data,
                total: cbzRevenueZwg
            });

            setStatistics({
                totalStudents,
                studentsOwing,
                cbzRevenueUsd,
                cbzRevenueZwg,
                zbRevenueUsd,
                zbRevenueZwg
            });

            // Fetch cash flow data
            await fetchCashFlowData(year);

            // Fetch student data for charts
            await fetchStudentDataForCharts();


        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            console.error('Full error:', error)
        } finally {
            setLoading(false)
        }
    };

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


    
    const actions = [
        { icon: '📄', name: 'Bulk Invoicing', path: '/bulk-invoicing' },
        { icon: '🔄', name: 'New Term', path: '/new-term' },
        { icon: '📅', name: 'New Year', path: '/new-year' }
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-center flex-1">Dashboard</h1>
            </div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="rounded-lg shadow-md p-4 bg-white">
                    <div className="flex items-center">
                        <UserGroupIcon className="h-12 w-12 text-blue-500 mr-4" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600">Total Students</h3>
                            <p className="text-2xl font-bold text-gray-900">{statistics.totalStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg shadow-md p-4 bg-white">
                    <div className="flex items-center">
                        <ExclamationCircleIcon className="h-12 w-12 text-red-500 mr-4" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600">Students Owing</h3>
                            <p className="text-2xl font-bold text-gray-900">{statistics.studentsOwing}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg shadow-md p-4 bg-white">
                    <div>
                        <div className="flex items-center mb-2">
                            <CurrencyDollarIcon className="h-12 w-12 text-green-500 mr-4" />
                            <h3 className="text-sm font-semibold text-gray-600">CBZ Net Revenue</h3>
                        </div>
                        <div className="space-y-1">
                            <p className="text-md font-semibold">USD: ${statistics.cbzRevenueUsd?.toFixed(2) || '0.00'}</p>
                            <p className="text-md font-semibold">ZWG: ${statistics.cbzRevenueZwg?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg shadow-md p-4 bg-white">
                    <div>
                        <div className="flex items-center mb-2">
                            <CurrencyDollarIcon className="h-12 w-12 text-purple-500 mr-4" />
                            <h3 className="text-sm font-semibold text-gray-600">ZB Net Revenue</h3>
                        </div>
                        <div className="space-y-1">
                            <p className="text-md font-semibold">USD: ${statistics.zbRevenueUsd?.toFixed(2) || '0.00'}</p>
                            <p className="text-md font-semibold">ZWG: ${statistics.zbRevenueZwg?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Levy Cash Flow</h2>
                    <div className="h-[300px] relative">
                        <Bar data={levyCashFlow} options={barChartOptions} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Gender Distribution</h2>
                    <div className="h-[300px] relative">
                        <Pie data={genderData} options={pieChartOptions} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Grade Distribution</h2>
                    <div className="h-[300px] relative">
                        <Pie data={gradeData} options={pieChartOptions} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Tuition Cash Flow</h2>
                    <div className="h-[300px] relative">
                        <Bar data={tuitionCashFlow} options={barChartOptions} />
                    </div>
                </div>
            </div>

            {/* Action Menu (Floating Button) */}
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

export default AdminDashboard;
