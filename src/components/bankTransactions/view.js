import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import supabase from '../../db/SupaBaseConfig';
import TopBar from '../ui/topbar';
import { fetchUser } from '../api/userApi';
import { useToast } from '../../contexts/ToastContext';
import DataTable from '../ui/dataTable';
import FAB from '../ui/FAB';

// Modal component
const PaymentModal = ({ open, onClose, accounts, onSubmit }) => {
    const [type, setType] = useState('outgoing');
    const [form, setForm] = useState({
        date: '',
        description: '',
        account: '',
        amount: '',
        category: '',
        party: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit({ ...form, type });
        onClose();
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
                                    {acc.Bank} - {acc.Branch} - {acc.AccNumber} ({acc.Currency})
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="amount" value={form.amount} onChange={handleChange} className="border rounded px-2 py-1 ml-2" required />
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
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OutgoingIncomingView = () => {
    const [context, setContext] = useState('outgoing');
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        date: '',
        account: '',
        currency: '',
        category: ''
    });
    const [modalOpen, setModalOpen] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    // Fetch accounts for filter and display
    useEffect(() => {
        const fetchAccounts = async () => {
            const { data, error } = await supabase
                .from('Accounts')
                .select('id, AccNumber, Currency, Bank, Branch');
            if (!error && data) {
                const accMap = {};
                data.forEach(acc => {
                    accMap[acc.id] = acc;
                });
                setAccounts(accMap);
            }
        };
        fetchAccounts();
    }, []);

    // Fetch transactions with filters
    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchTransactions = async () => {
            let query;
            if (context === 'outgoing') {
                query = supabase
                    .from('OutgoingBankTransactions')
                    .select('id, Date, Description, To, Amount, Category, Account');
            } else {
                query = supabase
                    .from('IncomingBankTransactions')
                    .select('id, Date, Description, From, Amount, Category, Account');
            }
            // Apply filters
            if (filters.date) query = query.eq('Date', filters.date);
            if (filters.account) query = query.eq('Account', filters.account);
            if (filters.category) query = query.eq('Category', filters.category);

            const { data, error } = await query;
            let filtered = data || [];
            if (filters.currency) {
                filtered = filtered.filter(tx => {
                    const acc = accounts[tx.Account];
                    return acc && acc.Currency === filters.currency;
                });
            }
            if (error) setError('Failed to fetch transactions');
            else setTransactions(filtered);
            setLoading(false);
        };
        fetchTransactions();
        // eslint-disable-next-line
    }, [context, filters, accounts]);

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

    // Table columns
    const columns = [
        { header: 'Date', accessor: 'Date' },
        { header: 'Description', accessor: 'Description' },
        { header: context === 'outgoing' ? 'To' : 'From', render: row => context === 'outgoing' ? row.To : row.From },
        { header: 'Amount', accessor: 'Amount' },
        { header: 'Category', accessor: 'Category' },
        {
            header: 'AccNumber',
            render: row => accounts[row.Account]?.AccNumber || '-'
        },
        {
            header: 'Currency',
            render: row => accounts[row.Account]?.Currency || '-'
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

    // Handle new payment submission
    const handleNewPayment = async (data) => {
        const { type, date, description, account, amount, category, party } = data;
        let table = type === 'outgoing' ? 'OutgoingBankTransactions' : 'IncomingBankTransactions';
        let payload = {
            Date: date,
            Description: description,
            Account: account,
            Amount: amount,
            Category: category,
        };
        if (type === 'outgoing') payload.To = party;
        else payload.From = party;

        const { error } = await supabase.from(table).insert([payload]);
        if (error) addToast('Failed to add payment', 'error');
        else addToast('Payment added!', 'success');
    };

    // Unique filter options
    const accountOptions = Object.values(accounts).map(acc => ({
        value: acc.id,
        label: `${acc.Bank} - ${acc.Branch} - ${acc.AccNumber} (${acc.Currency})`
    }));
    const currencyOptions = [...new Set(Object.values(accounts).map(acc => acc.Currency))]
        .map(cur => ({ value: cur, label: cur.toUpperCase() }));
    const categoryOptions = [
        ...new Set(transactions.map(tx => tx.Category))
    ].map(cat => ({ value: cat, label: cat }));

    return (
        <div className="p-6 bg-background min-h-screen relative">
            <TopBar title="Transactions" userName={userData?.name} />
            <div className="p-4">
                <PaymentModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    accounts={accounts}
                    onSubmit={handleNewPayment}
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
