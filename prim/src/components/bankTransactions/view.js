import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import supabase from '../../db/SupaBaseConfig';
import ContextSwitch from '../ui/contextSwitch';
import TopBar from '../ui/topbar';
import { fetchUser } from '../api/userApi';
import { useToast } from '../../contexts/ToastContext';
import DataTable from '../ui/dataTable';

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
        },
        {
            header: 'Invoices',
            render: row => (
                <button
                    className="text-blue-600 underline"
                    onClick={() => navigate('/create-invoice')}
                >
                    Link
                </button>
            )
        }
    ];

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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <ContextSwitch
                        options={[
                            { label: 'Outgoing', value: 'outgoing' },
                            { label: 'Incoming', value: 'incoming' }
                        ]}
                        value={context}
                        onChange={setContext}
                    />
                    <div className="flex gap-2 flex-wrap">
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
                            <option value="">All Currencies</option>
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
            </div>
        </div>
    );
};

export default OutgoingIncomingView;
