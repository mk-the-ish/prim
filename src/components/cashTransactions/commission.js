import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUser } from '../api/userApi';
import TopBar from '../ui/topbar';
import Loader from '../ui/loader';
import DataTable from '../ui/dataTable';
import FAB from '../ui/FAB';
import Card from '../ui/card';
import Modal from '../ui/modal';
import Form from '../ui/form';
import { useTheme } from '../../contexts/ThemeContext';
import { fetchCommissions, addCommission } from '../api/viewPaymentsApi';

const CommissionFormModal = ({ open, onClose, onSubmit, isLoading }) => {
    const [form, setForm] = useState({
        date: '',
        description: '',
        recipient: '',
        amount: '',
        flow: 'in',
        category: '',
    });

    React.useEffect(() => {
        if (open) {
            setForm({
                date: '',
                description: '',
                recipient: '',
                amount: '',
                flow: 'in',
                category: '',
            });
        }
    }, [open]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(form);
    };

    if (!open) return null;
    return (
        <Modal open={open} onClose={onClose}>
            <Form onSubmit={handleSubmit} title="Add Commission" loading={isLoading}>
                <div className="flex flex-col md:flex-row gap-4">
                    <Form.Input
                        label="Date"
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                    />
                    <Form.Select
                        label="Flow"
                        name="flow"
                        value={form.flow}
                        onChange={handleChange}
                        options={[
                            { value: 'in', label: 'IN' },
                            { value: 'out', label: 'OUT' }
                        ]}
                        required
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <Form.Input
                        label="Description"
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                    <Form.Input
                        label="Recipient"
                        type="text"
                        name="recipient"
                        value={form.recipient}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <Form.Input
                        label="Category"
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                    />
                    <Form.Input
                        label="Amount"
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
            </Form>
        </Modal>
    );
};

function Commission() {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterFlow, setFilterFlow] = useState('');
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const queryClient = useQueryClient();

    // User query
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login'),
        onSuccess: (data) => {
            if (!data || !['admin', 'bursar'].includes(data.role)) {
                navigate('/unauthorised');
            }
        }
    });

    // Commissions query
    const {
        data: commissions = [],
        isLoading: commissionsLoading,
        refetch: refetchCommissions
    } = useQuery({
        queryKey: ['commissions'],
        queryFn: fetchCommissions,
    });

    // Add commission mutation
    const addCommissionMutation = useMutation({
        mutationFn: addCommission,
        onSuccess: () => {
            queryClient.invalidateQueries(['commissions']);
            setModalOpen(false);
        }
    });

    // Filter commissions by flow if selected
    const filteredCommissions = filterFlow
        ? commissions.filter(c => c.flow === filterFlow)
        : commissions;

    // Calculate commissions balance
    const totalIn = commissions.filter(c => c.flow === 'in').reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const totalOut = commissions.filter(c => c.flow === 'out').reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const balance = totalIn - totalOut;

    const columns = [
        { header: 'Date', render: row => new Date(row.date).toLocaleDateString() },
        { header: 'Description', accessor: 'description' },
        { header: 'Recipient', accessor: 'recipient' },
        { header: 'Category', accessor: 'category' },
        { header: 'Amount', accessor: 'amount', render: row => `$${Number(row.amount).toFixed(2)}` },
        { header: 'Flow', accessor: 'flow' }
    ];

    const fabActions = [
        <button
            key="add-commission"
            className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90"
            onClick={() => setModalOpen(true)}
        >
            <span role="img" aria-label="Add">➕</span> Add Commission
        </button>
    ];

    const handleAddCommission = async (form) => {
        await addCommissionMutation.mutateAsync(form);
    };

    if (userLoading || commissionsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background?.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: currentTheme.background?.default }}>
            <TopBar title="Commission Transactions" userName={userData?.name} />
            <div className="px-6 pt-6 flex gap-4 items-center">
                <label className="font-semibold">Filter by Flow:</label>
                <select
                    value={filterFlow}
                    onChange={e => setFilterFlow(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="">All</option>
                    <option value="in">IN</option>
                    <option value="out">OUT</option>
                </select>
            </div>
            <div className="pt-5 px-6 py-4">
                <Card title="Commissions Balance">
                    <div className="flex gap-8 items-center">
                        <div>
                            <span className="font-semibold">Total IN:</span>
                            <span className="ml-2 text-green-700">${totalIn.toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Total OUT:</span>
                            <span className="ml-2 text-red-700">${totalOut.toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Balance:</span>
                            <span className="ml-2 text-blue-700">${balance.toFixed(2)}</span>
                        </div>
                    </div>
                </Card>
                <Card title="Commissions">
                    <DataTable
                        columns={columns}
                        data={filteredCommissions}
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredCommissions.length / 10)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={10}
                    />
                </Card>
                <CommissionFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleAddCommission}
                    isLoading={addCommissionMutation.isLoading}
                />
                <FAB actions={fabActions} />
            </div>
        </div>
    );
}

export default Commission;