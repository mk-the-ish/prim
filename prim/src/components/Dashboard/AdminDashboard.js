import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from 'react-chartjs-2';
import { useQuery, useMutation } from "@tanstack/react-query";
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
import supabase from '../../db/SupaBaseConfig';
import FAB from '../ui/FAB';
import Modal from '../ui/modal';
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
        legend: { position: 'bottom' }
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

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [showAddTermModal, setShowAddTermModal] = useState(false);
    const [showNewYearModal, setShowNewYearModal] = useState(false);
    const [newTerm, setNewTerm] = useState({
        start_date: '',
        end_date: '',
        levy_billed: '',
        tuition_billed: ''
    });
    const [addTermLoading, setAddTermLoading] = useState(false);
    const [billingLoading, setBillingLoading] = useState(false);
    const [academicYearLoading, setAcademicYearLoading] = useState(false);
    const year = new Date().getFullYear();
    const { currentTheme } = useTheme();
    const { addToast } = useToast();
    const isMounted = useRef(true);
    const startDateRef = useRef(null);
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
        enabled: !!userData?.role && userData.role === 'admin',
        onError: () => { if (isMounted.current) addToast('Failed to fetch cash flow data.', 'error'); }
    });

    // Fetch all terms for overlap validation
    const { data: terms = [], refetch: refetchTerms } = useQuery({
        queryKey: ['terms'],
        queryFn: fetchTerms,
        enabled: showAddTermModal,
    });

    const [formErrors, setFormErrors] = useState({});

    // Focus first input when modal opens
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

    const loading = userLoading || statsLoading || chartsLoading || cashFlowLoading;
    const userRole = userData?.role;

    // Handler for Add New Term
    const handleAddNewTerm = async () => {
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;
        addTermMutation.mutate(newTerm);
    };

    // Handler for New Academic Year
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    // FAB actions
    const fabActions = [
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

    return (
        <div className="p-6 min-h-screen relative" style={{ background: currentTheme.background.default, color: currentTheme.text.primary }}>
            <TopBar title="Admin Dashboard" userName={userData?.name} />
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
                {/* FAB for admin actions */}
                <FAB actions={fabActions} />
                {/* Add New Term Modal */}
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
            </div>
        </div>
    );
};

export default AdminDashboard;
