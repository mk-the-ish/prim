import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from 'react-chartjs-2';
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    fetchDashboardStats,
    fetchStudentChartData,
    fetchCashFlowData,
    fetchRecentTransactions
} from '../api/dashboardApi';
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
    CurrencyDollarIcon,
    ReceiptRefundIcon
} from '@heroicons/react/24/solid';
import { fetchUser } from "../api/userApi";
import SummaryCard from '../ui/summaryCard';
import Loader from '../ui/loader';
import TopBar from '../ui/topbar';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import supabase from '../../db/SupaBaseConfig';
import FAB from '../ui/FAB';
import Modal from '../ui/modal';
import FormModal from '../ui/FormModal';
import Form from '../ui/form';
import { addTerm, fetchTerms } from "../api/termsApi";

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
        datasets: [{ data: [0, 0], backgroundColor: ['#36A2EB', '#FF6384'] }]
    },
    gradeData: {
        labels: ['Grade 1'],
        datasets: [{ data: [0], backgroundColor: ['#FF6384'] }]
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
        legend: { position: 'top' },
        tooltip: {
            callbacks: {
                label: (context) => `$${context.raw.toLocaleString()}`
            }
        }
    }
};

const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' }
    }
};

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

const Dashboard = () => {
    const navigate = useNavigate();
    const [showAddTermModal, setShowAddTermModal] = useState(false);
    const [showNewYearModal, setShowNewYearModal] = useState(false);
    const [showNewTermModal, setShowNewTermModal] = useState(false);
    const [showDailyRateModal, setShowDailyRateModal] = useState(false);
    const [newTerm, setNewTerm] = useState({
        start_date: '',
        end_date: '',
        levy_billed: '',
        tuition_billed: ''
    });
    const [addTermLoading, setAddTermLoading] = useState(false);
    const [academicYearLoading, setAcademicYearLoading] = useState(false);
    const [termId, setTermId] = useState("");
    const [password, setPassword] = useState("");
    const [billingLoading, setBillingLoading] = useState(false);
    const [billingError, setBillingError] = useState("");
    const [billingSuccess, setBillingSuccess] = useState("");
    const [dailyRateForm, setDailyRateForm] = useState({ Date: '', Rate: '' });
    const inputRef = useRef(null);
    const startDateRef = useRef(null);
    const year = new Date().getFullYear();
    const { currentTheme } = useTheme();
    const { addToast } = useToast();
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => fetchUser(),
        retry: false,
        onError: (error) => {
            if (!isMounted.current) return;
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

    // Queries
    const { data: statistics = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
        enabled: !!userData?.role && userData.role === 'admin',
        onError: () => { if (isMounted.current) addToast('Failed to fetch dashboard statistics.', 'error'); }
    });

    const { data: chartData = defaultChartData, isLoading: chartsLoading } = useQuery({
        queryKey: ['studentCharts'],
        queryFn: fetchStudentChartData,
        enabled: !!userData?.role && userData.role === 'admin',
        onError: () => { if (isMounted.current) addToast('Failed to fetch student chart data.', 'error'); }
    });

    const { data: cashFlowData = defaultCashFlowData, isLoading: cashFlowLoading } = useQuery({
        queryKey: ['cashFlow', year],
        queryFn: () => fetchCashFlowData(year),
        enabled: !!userData?.role,
        onError: () => { if (isMounted.current) addToast('Failed to fetch cash flow data.', 'error'); }
    });

    const { data: recentTransactions = [], isLoading: transactionsLoading } = useQuery({
        queryKey: ['recentTransactions'],
        queryFn: fetchRecentTransactions,
        enabled: !!userData?.role && userData.role === 'bursar',
        onError: () => addToast('Failed to fetch recent transactions.', 'error')
    });

    // Terms for overlap validation
    const { data: terms = [], refetch: refetchTerms } = useQuery({
        queryKey: ['terms'],
        queryFn: fetchTerms,
        enabled: showAddTermModal,
    });

    // Add Term Mutation
    const addTermMutation = useMutation({
        mutationFn: addTerm,
        onSuccess: () => {
            addToast('New term added successfully!', 'success');
            setShowAddTermModal(false);
            setNewTerm({ start_date: '', end_date: '', levy_billed: '', tuition_billed: '' });
            setFormErrors({});
            refetchTerms();
        },
        onError: (error) => {
            addToast(error.message || 'Failed to add new term.', 'error');
        },
    });

    // Daily Rate Mutation
    const dailyRateMutation = useMutation({
        mutationFn: async ({ Date, Rate }) => {
            const { error } = await supabase.from('DailyRate').insert([{ Date, Rate: parseFloat(Rate) }]);
            if (error) throw error;
        },
        onSuccess: () => {
            addToast('Daily rate added successfully!', 'success');
            setShowDailyRateModal(false);
            setDailyRateForm({ Date: '', Rate: '' });
        },
        onError: () => {
            addToast('Failed to add daily rate.', 'error');
        }
    });

    // Form errors
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (showAddTermModal && startDateRef.current) {
            startDateRef.current.focus();
        }
        if (!showAddTermModal) {
            setFormErrors({});
            setNewTerm({ start_date: '', end_date: '', levy_billed: '', tuition_billed: '' });
            addTermMutation.reset && addTermMutation.reset();
        }
    }, [showAddTermModal]);

    useEffect(() => {
        if (!showNewTermModal) {
            setTermId("");
            setPassword("");
            setBillingError("");
            setBillingSuccess("");
        } else {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [showNewTermModal]);

    function validateForm() {
        const errors = {};
        if (!newTerm.start_date) errors.start_date = 'Start date is required.';
        if (!newTerm.end_date) errors.end_date = 'End date is required.';
        if (newTerm.start_date && newTerm.end_date && newTerm.start_date > newTerm.end_date) {
            errors.end_date = 'End date must be after start date.';
        }
        if (!newTerm.levy_billed || isNaN(newTerm.levy_billed) || Number(newTerm.levy_billed) < 0) {
            errors.levy_billed = 'Levy billed must be a positive number.';
        }
        if (!newTerm.tuition_billed || isNaN(newTerm.tuition_billed) || Number(newTerm.tuition_billed) < 0) {
            errors.tuition_billed = 'Tuition billed must be a positive number.';
        }
        // Overlap check
        if (terms && newTerm.start_date && newTerm.end_date) {
            const overlap = terms.some(term => {
                return (
                    (newTerm.start_date <= term.end_date && newTerm.end_date >= term.start_date)
                );
            });
            if (overlap) {
                errors.start_date = 'Term dates overlap with an existing term.';
                errors.end_date = 'Term dates overlap with an existing term.';
            }
        }
        return errors;
    }

    // Add New Term Handler
    const handleAddNewTerm = async () => {
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;
        addTermMutation.mutate(newTerm);
    };

    // New Academic Year Handler
    const handleConfirmNewAcademicYear = async () => {
        setAcademicYearLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('new-academic-year', {
                method: 'POST',
            });
            if (error) throw new Error(error.message || 'Failed to upgrade academic year via Supabase Function');
            addToast(data.message || 'Academic year upgraded successfully!', 'success');
            setShowNewYearModal(false);
        } catch (error) {
            addToast(error.message || 'Error upgrading academic year.', 'error');
        } finally {
            setAcademicYearLoading(false);
        }
    };

    // Bill New Term Handler (Bursar)
    const handleNewTermBilling = async (e) => {
        e?.preventDefault();
        setBillingError("");
        setBillingSuccess("");
        if (!termId || !password) {
            setBillingError('Please enter both Term ID and your password.');
            return;
        }
        const savedPassword = "Bursar@1234";
        if (password !== savedPassword) {
            setBillingError('Incorrect password. Please try again.');
            return;
        }
        setBillingLoading(true);
        try {
            const url = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/new-term-billing`;
            const apikey = process.env.REACT_APP_SUPABASE_ANON_KEY;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": apikey,
                    "Authorization": `Bearer ${apikey}`,
                },
                body: JSON.stringify({ term_id: Number(termId) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to bill new term');
            setBillingSuccess(data.message || 'New term billed successfully!');
            addToast(data.message || 'New term billed successfully!', 'success');
            setTimeout(() => setShowNewTermModal(false), 1200);
        } catch (error) {
            setBillingError(error.message || 'Error billing new term.');
        } finally {
            setBillingLoading(false);
        }
    };

    // Daily Rate Handlers
    const handleDailyRateChange = (e) => {
        setDailyRateForm({ ...dailyRateForm, [e.target.name]: e.target.value });
    };

    const handleDailyRateSubmit = (e) => {
        e.preventDefault();
        dailyRateMutation.mutate(dailyRateForm);
    };

    const loading = userLoading || statsLoading || chartsLoading || cashFlowLoading || (userData?.role === 'bursar' && transactionsLoading);

    // FAB actions
    let fabActions = [];
    if (userData?.role === 'admin') {
        fabActions = [
            <button key="add-term" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => setShowAddTermModal(true)}>
                <span role="img" aria-label="Add New Term">➕</span> Add New Term
            </button>,
            <button key="add-class-teachers" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => navigate('/academic/class-teacher-assignment')}>
                <span role="img" aria-label="Add Class Teachers">👩‍🏫</span> Add Class Teachers
            </button>,
            <button key="new-year" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => setShowNewYearModal(true)} disabled={academicYearLoading}>
                <span role="img" aria-label="New Year">📅</span> {academicYearLoading ? 'Processing...' : 'New Year'}
            </button>
        ];
    } else if (userData?.role === 'bursar') {
        fabActions = [
            <button key="bulk-invoicing" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => navigate('/bulk-invoicing')}>
                <span role="img" aria-label="Bulk Invoicing">📄</span> Bulk Invoicing
            </button>,
            <button key="new-term" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => setShowNewTermModal(true)}>
                <span role="img" aria-label="New Term">🔄</span> New Term
            </button>,
            <button key="new-year" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={handleConfirmNewAcademicYear} disabled={academicYearLoading}>
                <span role="img" aria-label="New Year">📅</span> {academicYearLoading ? 'Processing...' : 'New Year'}
            </button>,
            <button key="add-daily-rate" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => setShowDailyRateModal(true)}>
                <span role="img" aria-label="Add Daily Rate">💱</span> Add Daily Rate
            </button>,
        ];
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen relative" style={{ background: currentTheme.background.default, color: currentTheme.text.primary }}>
            <TopBar title={userData?.role === 'admin' ? "Admin Dashboard" : "Bursar Dashboard"} userName={userData?.name} />
            <div className="p-2">
                {/* Summary Cards */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {userData?.role === 'admin' ? (
                        <>
                            <SummaryCard title="Total Students" icon={<UserGroupIcon className="text-blue-500" />} bgColor="bg-blue-200">
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                                    {statistics.totalStudents}
                                </p>
                            </SummaryCard>
                            <SummaryCard title="Students Owing" icon={<ExclamationCircleIcon className="text-red-500" />} bgColor="bg-red-200">
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                                    {statistics.studentsOwing}
                                </p>
                            </SummaryCard>
                            <SummaryCard title="CBZ Net Revenue" icon={<CurrencyDollarIcon className="text-green-500" />} bgColor="bg-green-200">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold" style={{ color: currentTheme.text.primary }}>
                                        USD: ${statistics.cbzRevenueUsd?.toFixed(2) || '0.00'}
                                    </p>
                                    <p className="text-sm font-semibold" style={{ color: currentTheme.text.primary }}>
                                        ZWG: ${statistics.cbzRevenueZwg?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                            </SummaryCard>
                            <SummaryCard title="ZB Net Revenue" icon={<CurrencyDollarIcon className="text-purple-500" />} bgColor="bg-purple-200">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold" style={{ color: currentTheme.text.primary }}>
                                        USD: ${statistics.zbRevenueUsd?.toFixed(2) || '0.00'}
                                    </p>
                                    <p className="text-sm font-semibold" style={{ color: currentTheme.text.primary }}>
                                        ZWG: ${statistics.zbRevenueZwg?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                            </SummaryCard>
                        </>
                    ) : (
                        <>
                            <SummaryCard title="Levy Cash In" icon={<CurrencyDollarIcon className="text-blue-500" />} bgColor="bg-blue-200">
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                                    ${cashFlowData.levyCashFlow.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
                                </p>
                            </SummaryCard>
                            <SummaryCard title="Levy Cash Out" icon={<ReceiptRefundIcon className="text-red-500" />} bgColor="bg-red-200">
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                                    ${cashFlowData.levyCashFlow.datasets[1].data.reduce((a, b) => a + b, 0).toLocaleString()}
                                </p>
                            </SummaryCard>
                            <SummaryCard title="Tuition Cash In" icon={<CurrencyDollarIcon className="text-green-500" />} bgColor="bg-green-200">
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                                    ${cashFlowData.tuitionCashFlow.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
                                </p>
                            </SummaryCard>
                            <SummaryCard title="Tuition Cash Out" icon={<ReceiptRefundIcon className="text-yellow-500" />} bgColor="bg-yellow-200">
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                                    ${cashFlowData.tuitionCashFlow.datasets[1].data.reduce((a, b) => a + b, 0).toLocaleString()}
                                </p>
                            </SummaryCard>
                        </>
                    )}
                </div>
                {/* Charts */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <ChartContainer title="Levy Cash Flow">
                        <Bar data={cashFlowData.levyCashFlow} options={barChartOptions} />
                    </ChartContainer>
                    {userData?.role === 'admin' && (
                        <ChartContainer title="Gender Distribution">
                            <Pie data={chartData.genderData} options={pieChartOptions} />
                        </ChartContainer>
                    )}
                    {userData?.role === 'admin' && (
                        <ChartContainer title="Grade Distribution">
                            <Pie data={chartData.gradeData} options={pieChartOptions} />
                        </ChartContainer>
                    )}
                    <ChartContainer title="Tuition Cash Flow">
                        <Bar data={cashFlowData.tuitionCashFlow} options={barChartOptions} />
                    </ChartContainer>
                </div>
                {/* Recent Transactions Table (Bursar only) */}
                {userData?.role === 'bursar' && (
                    <div className="mt-8 rounded-lg shadow-md p-6" style={{ background: currentTheme.background.paper, color: currentTheme.text.primary }}>
                        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Description</th>
                                        <th className="px-4 py-2 text-left">Amount</th>
                                        <th className="px-4 py-2 text-left">Type</th>
                                        <th className="px-4 py-2 text-left">Currency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-4">No recent transactions.</td></tr>
                                    ) : recentTransactions.map((txn, idx) => (
                                        <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-4 py-2">{txn.Date || txn.created_at}</td>
                                            <td className="px-4 py-2">{txn.Description}</td>
                                            <td className="px-4 py-2">${txn.Amount?.toLocaleString()}</td>
                                            <td className="px-4 py-2">{txn.Type || txn.Category}</td>
                                            <td className="px-4 py-2">{txn.Currency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* FAB */}
                <FAB actions={fabActions} />
                {/* Modals */}
                {/* Admin: Add New Term Modal */}
                <Modal open={showAddTermModal} onClose={() => setShowAddTermModal(false)}>
                    <h2 className="text-lg font-bold mb-4">Add New Term</h2>
                    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleAddNewTerm(); }} aria-label="Add New Term Form">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1" htmlFor="start_date">Start Date</label>
                                <input
                                    id="start_date"
                                    type="date"
                                    ref={startDateRef}
                                    value={newTerm.start_date}
                                    onChange={e => setNewTerm({ ...newTerm, start_date: e.target.value })}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.start_date ? 'border-red-500' : ''}`}
                                    aria-invalid={!!formErrors.start_date}
                                    aria-describedby="start_date_error"
                                />
                                {formErrors.start_date && <span id="start_date_error" className="text-red-500 text-xs">{formErrors.start_date}</span>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1" htmlFor="end_date">End Date</label>
                                <input
                                    id="end_date"
                                    type="date"
                                    value={newTerm.end_date}
                                    onChange={e => setNewTerm({ ...newTerm, end_date: e.target.value })}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.end_date ? 'border-red-500' : ''}`}
                                    aria-invalid={!!formErrors.end_date}
                                    aria-describedby="end_date_error"
                                />
                                {formErrors.end_date && <span id="end_date_error" className="text-red-500 text-xs">{formErrors.end_date}</span>}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1" htmlFor="levy_billed">Levy Billed</label>
                                <input
                                    id="levy_billed"
                                    type="number"
                                    value={newTerm.levy_billed}
                                    onChange={e => setNewTerm({ ...newTerm, levy_billed: e.target.value })}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.levy_billed ? 'border-red-500' : ''}`}
                                    placeholder="Levy Amount"
                                    aria-invalid={!!formErrors.levy_billed}
                                    aria-describedby="levy_billed_error"
                                />
                                {formErrors.levy_billed && <span id="levy_billed_error" className="text-red-500 text-xs">{formErrors.levy_billed}</span>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1" htmlFor="tuition_billed">Tuition Billed</label>
                                <input
                                    id="tuition_billed"
                                    type="number"
                                    value={newTerm.tuition_billed}
                                    onChange={e => setNewTerm({ ...newTerm, tuition_billed: e.target.value })}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.tuition_billed ? 'border-red-500' : ''}`}
                                    placeholder="Tuition Amount"
                                    aria-invalid={!!formErrors.tuition_billed}
                                    aria-describedby="tuition_billed_error"
                                />
                                {formErrors.tuition_billed && <span id="tuition_billed_error" className="text-red-500 text-xs">{formErrors.tuition_billed}</span>}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowAddTermModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                                disabled={addTermMutation.isLoading || Object.keys(formErrors).length > 0}
                                aria-disabled={addTermMutation.isLoading || Object.keys(formErrors).length > 0}
                            >
                                {addTermMutation.isLoading ? (
                                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                                        <path d="M4 12a8 8 0 018-8m0 16a8 8 0 01-8-8" className="opacity-75" />
                                    </svg>
                                ) : null}
                                Add Term
                            </button>
                        </div>
                    </form>
                </Modal>
                {/* Bursar: Bill New Term Modal */}
                <Modal open={showNewTermModal} onClose={() => setShowNewTermModal(false)}>
                    <form onSubmit={handleNewTermBilling} aria-labelledby="bill-term-title">
                        <h2 id="bill-term-title" className="text-lg font-bold mb-4">Bill New Term</h2>
                        <p className="text-sm mb-4 text-gray-500">Enter the Term ID and your password to bill the new term.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="termId">Term ID</label>
                                <input
                                    id="termId"
                                    ref={inputRef}
                                    type="text"
                                    value={termId}
                                    onChange={e => setTermId(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Term ID"
                                    required
                                    aria-required="true"
                                    style={{
                                        background: currentTheme.background?.paper,
                                        color: currentTheme.text?.primary,
                                        border: `1px solid ${currentTheme.divider || '#d1d5db'}`
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                    required
                                    aria-required="true"
                                    style={{
                                        background: currentTheme.background?.paper,
                                        color: currentTheme.text?.primary,
                                        border: `1px solid ${currentTheme.divider || '#d1d5db'}`
                                    }}
                                />
                            </div>
                            {billingError && <div className="text-red-600 mb-2" role="alert">{billingError}</div>}
                            {billingSuccess && <div className="text-green-600 mb-2" role="status">{billingSuccess}</div>}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowNewTermModal(false)}
                                className="px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                                disabled={billingLoading}
                            >
                                {billingLoading ? (
                                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                                        <path d="M4 12a8 8 0 018-8m0 16a8 8 0 01-8-8" className="opacity-75" />
                                    </svg>
                                ) : null}
                                Bill New Term
                            </button>
                        </div>
                    </form>
                </Modal>
                {/* New Academic Year Modal */}
                <Modal open={showNewYearModal} onClose={() => setShowNewYearModal(false)}>
                    <h2 className="text-lg font-bold mb-4">Upgrade to New Academic Year</h2>
                    <p className="text-sm mb-4 text-gray-500">
                        Are you sure you want to upgrade to a new academic year? This action cannot be undone.
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            onClick={() => setShowNewYearModal(false)}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmNewAcademicYear}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                            disabled={academicYearLoading}
                        >
                            {academicYearLoading ? (
                                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                                    <path d="M4 12a8 8 0 018-8m0 16a8 8 0 01-8-8" className="opacity-75" />
                                </svg>
                            ) : null}
                            Upgrade Year
                        </button>
                    </div>
                </Modal>
                {/* Add Daily Rate Modal (Bursar only) */}
                <FormModal
                    open={showDailyRateModal}
                    onClose={() => setShowDailyRateModal(false)}
                    title="Add Daily Rate"
                >
                    <Form onSubmit={handleDailyRateSubmit} loading={dailyRateMutation.isLoading}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Form.Input
                                label="Date"
                                type="date"
                                name="Date"
                                value={dailyRateForm.Date}
                                onChange={handleDailyRateChange}
                                required
                            />
                            <Form.Input
                                label="Rate"
                                type="number"
                                name="Rate"
                                value={dailyRateForm.Rate}
                                onChange={handleDailyRateChange}
                                required
                                step="0.0001"
                            />
                        </div>
                    </Form>
                </FormModal>
            </div>
        </div>
    );
};

export default Dashboard;
