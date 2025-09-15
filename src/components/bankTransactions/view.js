import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import supabase from '../../db/SupaBaseConfig';
import TopBar from '../ui/topbar';
import { fetchUser } from '../api/userApi';
import { useToast } from '../../contexts/ToastContext';
import DataTable from '../ui/dataTable';
import FAB from '../ui/FAB';

// Modal component
const PaymentModal = ({ open, onClose, accounts, onSubmit, isLoading }) => {
    const [type, setType] = useState('outgoing');
    const [form, setForm] = useState({
        date: '',
        description: '',
        account: '',
        amount: '',
        category: '',
        party: ''
    });

    React.useEffect(() => {
        if (open) {
            setType('outgoing');
            setForm({
                date: '',
                description: '',
                account: '',
                amount: '',
                category: '',
                party: ''
            });
        }
    }, [open]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit({ ...form, type });
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">New Payment</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label>
                        Type:
                        <select name="type" value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1 ml-2">
                            <option value="outgoing">Outgoing</option>
                            <option value="incoming">Incoming</option>
                        </select>
                    </label>
                    <label>
                        Date:
                        <input type="date" name="date" value={form.date} onChange={handleChange} className="border rounded px-2 py-1 ml-2" required />
                    </label>
                    <label>
                        Description:
                        <input type="text" name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1 ml-2" required />
                    </label>
                    <label>
                        Account:
                        <select name="account" value={form.account} onChange={handleChange} className="border rounded px-2 py-1 ml-2" required>
                            <option value="">Select Account</option>
                            {Object.values(accounts).map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.bank} - {acc.branch} - {acc.accNumber} ({acc.currency})
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="amount" value={form.amount} onChange={handleChange} className="border rounded px-2 py-1 ml-2" required min="0" step="0.01" />
                    </label>
                    <label>
                        Category:
                        <input type="text" name="category" value={form.category} onChange={handleChange} className="border rounded px-2 py-1 ml-2" required />
                    </label>
                    <label>
                        {type === 'outgoing' ? 'To:' : 'From:'}
                        <input type="text" name="party" value={form.party} onChange={handleChange} className="border rounded px-2 py-1 ml-2" required />
                    </label>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded" disabled={isLoading}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const fetchAccounts = async () => {
    const { data, error } = await supabase
        .from('Accounts')
        .select('id, accNumber, currency, bank, branch');
    if (error) throw error;
    return data || [];
};

const fetchTransactions = async ({ queryKey }) => {
    const [_key, { context, filters }] = queryKey;
    let query = supabase
        .from('Bank')
        .select('id, date, description, payee, amount, category, accountId, flow');

    // Map context to schema values
    const flowValue = context === 'outgoing' ? 'out' : 'in';
    query = query.eq('flow', flowValue);

    if (filters.date) query = query.eq('date', filters.date);
    if (filters.account) query = query.eq('accountId', filters.account);
    if (filters.category) query = query.eq('category', filters.category);

    // Currency filter: filter by account's currency, not Bank table
    // We'll filter in JS after fetching, since currency is not in Bank table
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};

const OutgoingIncomingView = () => {
    const [context, setContext] = useState('outgoing');
    const [filters, setFilters] = useState({
        date: '',
        account: '',
        currency: '',
        category: ''
    });
    const [modalOpen, setModalOpen] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch accounts
    const { data: accountsArr = [], isLoading: accountsLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: fetchAccounts
    });
    // Map accounts by id for easy lookup
    const accounts = React.useMemo(() => {
        const accMap = {};
        accountsArr.forEach(acc => { accMap[acc.id] = acc; });
        return accMap;
    }, [accountsArr]);

    // Fetch transactions
    const {
        data: transactionsRaw = [],
        isLoading: transactionsLoading,
        refetch: refetchTransactions
    } = useQuery({
        queryKey: ['transactions', { context, filters }],
        queryFn: fetchTransactions,
        keepPreviousData: true
    });

    // Filter by currency (since currency is in Accounts, not Bank)
    const transactions = React.useMemo(() => {
        if (!filters.currency) return transactionsRaw;
        return transactionsRaw.filter(tx => accounts[tx.accountId]?.currency === filters.currency);
    }, [transactionsRaw, filters.currency, accounts]);

    // Fetch user for topbar
    const { data: userData } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: (error) => {
            if (error.message.includes('Not authenticated')) {
                addToast('You are not authenticated. Please login.', 'error');
                navigate('/login');
            } else {
                addToast('User fetch error.', 'error');
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 300000,
        cacheTime: 600000
    });

    // Add payment mutation
    const addPaymentMutation = useMutation({
        mutationFn: async (data) => {
            const { type, date, description, account, amount, category, party } = data;
            let flow = type === 'outgoing' ? 'out' : 'in';
            let payload = {
                date,
                description,
                accountId: account,
                amount: parseFloat(amount),
                category,
                flow,
                payee: party
            };
            const { error } = await supabase.from('Bank').insert([payload]);
            if (error) throw error;
        },
        onSuccess: () => {
            setModalOpen(false);
            queryClient.invalidateQueries(['transactions']);
        },
        onError: () => {
            addToast('Failed to add payment', 'error');
        }
    });

    // Unique filter options
    const accountOptions = accountsArr.map(acc => ({
        value: acc.id,
        label: `${acc.bank} - ${acc.branch} - ${acc.accNumber} (${acc.currency})`
    }));
    const currencyOptions = [...new Set(accountsArr.map(acc => acc.currency))]
        .filter(cur => !!cur)
        .map(cur => ({ value: cur, label: cur.toUpperCase() }));
    const categoryOptions = [
        ...new Set(transactionsRaw.map(tx => tx.category))
    ].map(cat => ({ value: cat, label: cat }));

    // Table columns
    const columns = [
        { header: 'Date', accessor: 'date' },
        { header: 'Description', accessor: 'description' },
        { header: context === 'outgoing' ? 'To' : 'From', render: row => row.payee },
        { header: 'Amount', accessor: 'amount' },
        { header: 'Category', accessor: 'category' },
        {
            header: 'AccNumber',
            render: row => accounts[row.accountId]?.accNumber || '-'
        },
        {
            header: 'Currency',
            render: row => accounts[row.accountId]?.currency || '-'
        }
    ];

    // FAB actions
    const fabActions = [
        <button key="add-term" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => setModalOpen(true)}>
            <span role="img" aria-label="Add New Term">➕</span> New Payment
        </button>,
        <button key="add-class-teachers" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => navigate('/vendors')}>
            <span role="img" aria-label="Add Class Teachers">👩‍🏫</span> View Vendors
        </button>,
        <button key="new-year" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => navigate('/view-invoices')}>
            <span role="img" aria-label="New Year">📅</span> View Invoices
        </button>
    ];

    if (accountsLoading || transactionsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-6 bg-background min-h-screen relative">
            <TopBar title="Transactions" userName={userData?.name} />
            <div className="p-4">
                <PaymentModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    accounts={accounts}
                    onSubmit={addPaymentMutation.mutate}
                    isLoading={addPaymentMutation.isLoading}
                />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    {/* Inline filters including context */}
                    <div className="flex gap-2 flex-wrap">
                        {/* Context filter */}
                        <select
                            value={context}
                            onChange={e => setContext(e.target.value)}
                            className="border rounded px-2 py-1"
                        >
                            <option value="outgoing">Outgoing</option>
                            <option value="incoming">Incoming</option>
                        </select>
                        <input
                            type="date"
                            value={filters.date}
                            onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
                            className="border rounded px-2 py-1"
                            placeholder="Date"
                        />
                        <select
                            value={filters.account}
                            onChange={e => setFilters(f => ({ ...f, account: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All Accounts</option>
                            {accountOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <select
                            value={filters.currency}
                            onChange={e => setFilters(f => ({ ...f, currency: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All $</option>
                            {currencyOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <select
                            value={filters.category}
                            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All Categories</option>
                            {categoryOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={transactions}
                    currentPage={1}
                    totalPages={1}
                    itemsPerPage={transactions.length}
                    onPageChange={() => {}}
                />
                <FAB actions={fabActions} />
            </div>
        </div>
    );
};

export default OutgoingIncomingView;
