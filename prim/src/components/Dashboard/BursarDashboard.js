import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCashFlowData, fetchRecentTransactions } from '../../components/api/dashboardApi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CurrencyDollarIcon, ReceiptRefundIcon } from '@heroicons/react/24/solid';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const BursarDashboard = () => {
    const navigate = useNavigate();
    const [showNewTermModal, setShowNewTermModal] = useState(false);
    const [termId, setTermId] = useState("");
    const [password, setPassword] = useState("");
    const [billingLoading, setBillingLoading] = useState(false);
    const [billingError, setBillingError] = useState("");
    const [billingSuccess, setBillingSuccess] = useState("");
    const [academicYearLoading, setAcademicYearLoading] = useState(false);
    const [showDailyRateModal, setShowDailyRateModal] = useState(false);
    const [dailyRateForm, setDailyRateForm] = useState({ Date: '', Rate: '' });
    const inputRef = useRef(null);
    const year = new Date().getFullYear();
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    const { data: cashFlowData = defaultCashFlowData, isLoading: cashFlowLoading } = useQuery({
        queryKey: ['cashFlow', year],
        queryFn: () => fetchCashFlowData(year),
        onError: () => addToast('Failed to fetch cash flow data.', 'error')
    });

    const { data: recentTransactions = [], isLoading: transactionsLoading } = useQuery({
        queryKey: ['recentTransactions'],
        queryFn: fetchRecentTransactions,
        onError: () => addToast('Failed to fetch recent transactions.', 'error')
    });

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

    // Reset modal state on close
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

    // New Term Billing Handler (Edge Function, accessibility, feedback)
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

    // New Academic Year Handler (same as admin)
    const handleNewAcademicYear = async () => {
        if (!window.confirm("Are you sure you want to upgrade to a new academic year? This action cannot be undone.")) {
            return;
        }
        setAcademicYearLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('new-academic-year', {
                method: 'POST',
            });
            if (error) throw new Error(error.message || 'Failed to upgrade academic year via Supabase Function');
            addToast(data.message || 'Academic year upgraded successfully!', 'success');
        } catch (error) {
            addToast(error.message || 'Error upgrading academic year.', 'error');
        } finally {
            setAcademicYearLoading(false);
        }
    };

    const handleDailyRateChange = (e) => {
        setDailyRateForm({ ...dailyRateForm, [e.target.name]: e.target.value });
    };

    const handleDailyRateSubmit = (e) => {
        e.preventDefault();
        dailyRateMutation.mutate(dailyRateForm);
    };

    if (cashFlowLoading || transactionsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    // FAB actions for bursar
    const fabActions = [
        <button key="bulk-invoicing" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => navigate('/bulk-invoicing')}>
            <span role="img" aria-label="Bulk Invoicing">📄</span> Bulk Invoicing
        </button>,
        <button key="new-term" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => setShowNewTermModal(true)}>
            <span role="img" aria-label="New Term">🔄</span> New Term
        </button>,
        <button key="new-year" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={handleNewAcademicYear} disabled={academicYearLoading}>
            <span role="img" aria-label="New Year">📅</span> {academicYearLoading ? 'Processing...' : 'New Year'}
        </button>,
        <button key="add-daily-rate" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => setShowDailyRateModal(true)}>
            <span role="img" aria-label="Add Daily Rate">💱</span> Add Daily Rate
        </button>,
    ];

    return (
        <div className="p-6 min-h-screen relative" style={{ background: currentTheme.background.default, color: currentTheme.text.primary }}>
            <TopBar title="Bursar Dashboard" />
            <div className="p-2">
                {/* Summary Cards */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                        title="Levy Cash In"
                        icon={<CurrencyDollarIcon className="text-blue-500" />}
                        bgColor="bg-blue-200"
                    >
                        <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                            ${cashFlowData.levyCashFlow.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
                        </p>
                    </SummaryCard>
                    <SummaryCard
                        title="Levy Cash Out"
                        icon={<ReceiptRefundIcon className="text-red-500" />}
                        bgColor="bg-red-200"
                    >
                        <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                            ${cashFlowData.levyCashFlow.datasets[1].data.reduce((a, b) => a + b, 0).toLocaleString()}
                        </p>
                    </SummaryCard>
                    <SummaryCard
                        title="Tuition Cash In"
                        icon={<CurrencyDollarIcon className="text-green-500" />}
                        bgColor="bg-green-200"
                    >
                        <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                            ${cashFlowData.tuitionCashFlow.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
                        </p>
                    </SummaryCard>
                    <SummaryCard
                        title="Tuition Cash Out"
                        icon={<ReceiptRefundIcon className="text-yellow-500" />}
                        bgColor="bg-yellow-200"
                    >
                        <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>
                            ${cashFlowData.tuitionCashFlow.datasets[1].data.reduce((a, b) => a + b, 0).toLocaleString()}
                        </p>
                    </SummaryCard>
                </div>
                {/* Cashflow Charts */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="rounded-lg shadow-md p-6" style={{ background: currentTheme.background.paper, color: currentTheme.text.primary }}>
                        <h2 className="text-lg font-semibold mb-4">Levy Cash Flow</h2>
                        <div className="h-[300px] relative">
                            <Bar data={cashFlowData.levyCashFlow} options={barChartOptions} />
                        </div>
                    </div>
                    <div className="rounded-lg shadow-md p-6" style={{ background: currentTheme.background.paper, color: currentTheme.text.primary }}>
                        <h2 className="text-lg font-semibold mb-4">Tuition Cash Flow</h2>
                        <div className="h-[300px] relative">
                            <Bar data={cashFlowData.tuitionCashFlow} options={barChartOptions} />
                        </div>
                    </div>
                </div>
                {/* Recent Transactions Table */}
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
                {/* FAB for bursar actions */}
                <FAB actions={fabActions} />
                {/* New Term Modal with accessibility and reset */}
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
                {/* Add Daily Rate Modal */}
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

export default BursarDashboard;
