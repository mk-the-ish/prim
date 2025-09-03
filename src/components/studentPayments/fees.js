import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../api/userApi';
import { fetchFees } from '../api/viewPaymentsApi';
import DataTable from '../ui/dataTable';
import Card from '../ui/card';
import TopBar from '../ui/topbar';

const ITEMS_PER_PAGE = 10;

const Fees = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        currency: '',
        type: '',
        grade: '',
        class: '',
        date: '',
        account: ''
    });
    const [accountOptions, setAccountOptions] = useState([]);

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login')
    });

    const { data: Fees = [], isLoading: feesLoading } = useQuery({
        queryKey: ['fees'],
        queryFn: fetchFees,
        enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role)
    });

    // Fetch account options for filter
    useEffect(() => {
        // Only fetch if not already fetched
        if (accountOptions.length === 0) {
            import('../../db/SupaBaseConfig').then(({ default: supabase }) => {
                supabase
                    .from('Accounts')
                    .select('id, AccNumber, Bank, Branch, Currency')
                    .then(({ data }) => {
                        if (data) setAccountOptions(data);
                    });
            });
        }
    }, [accountOptions.length]);

    // Filter logic
    const filteredFees = Fees.filter(fee => {
        const matchesCurrency = filters.currency ? fee.Currency === filters.currency : true;
        const matchesType = filters.type ? fee.Type === filters.type : true;
        const matchesGrade = filters.grade ? fee.Students?.Grade === filters.grade : true;
        const matchesClass = filters.class ? fee.Students?.Class === filters.class : true;
        const matchesDate = filters.date ? fee.Date === filters.date : true;
        const matchesAccount = filters.account
            ? (fee.Accounts ? String(fee.Accounts.id) === filters.account : String(fee.Account) === filters.account)
            : true;
        return matchesCurrency && matchesType && matchesGrade && matchesClass && matchesDate && matchesAccount;
    });

    // Collect unique values for filter dropdowns
    const currencyOptions = [...new Set(Fees.map(fee => fee.Currency))];
    const typeOptions = [...new Set(Fees.map(fee => fee.Type))];
    const gradeOptions = [...new Set(Fees.map(fee => fee.Students?.Grade).filter(Boolean))];
    const classOptions = [...new Set(Fees.map(fee => fee.Students?.Class).filter(Boolean))];

    const columns = [
        {
            header: 'Student Name',
            render: (row) => row.Students ? `${row.Students.FirstNames} ${row.Students.Surname}` : 'N/A'
        },
        { header: 'Grade', render: (row) => row.Students?.Grade || 'N/A' },
        { header: 'Class', render: (row) => row.Students?.Class || 'N/A' },
        { header: 'Gender', render: (row) => row.Students?.Gender || 'N/A' },
        { header: 'Date', render: (row) => new Date(row.Date).toLocaleDateString() },
        { header: 'Amount USD', accessor: 'AmountUSD' },
        { header: 'Amount ZWG', accessor: 'AmountZWG' },
        { header: 'Type', accessor: 'Type' },
        { header: 'Payment Timeline', accessor: 'PaymentTimeline' },
        { header: 'Form', accessor: 'Form' },
        { header: 'Currency', accessor: 'Currency' },
        { header: 'Reference', accessor: 'Reference' },
        { header: 'Receipt Number', accessor: 'receipt_number' },
        { header: 'Account', render: row => row.Accounts ? row.Accounts.AccNumber : row.Account || 'N/A' }
    ];

    return (
        <div className="min-h-screen bg-background">
            <TopBar title="Fees Table" userName={userData?.name} />
            <div className="p-6">
                <Card title="Fees" className="mb-4">
                    <div className="flex flex-wrap gap-4 mb-4">
                        <select
                            value={filters.account}
                            onChange={e => setFilters(f => ({ ...f, account: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All Accounts</option>
                            {accountOptions.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.Bank} - {acc.Branch} - {acc.AccNumber} ({acc.Currency})
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.currency}
                            onChange={e => setFilters(f => ({ ...f, currency: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All Currencies</option>
                            {currencyOptions.map(opt => (
                                <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                            ))}
                        </select>
                        <select
                            value={filters.type}
                            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All Types</option>
                            {typeOptions.map(opt => (
                                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>
                        <select
                            value={filters.grade}
                            onChange={e => setFilters(f => ({ ...f, grade: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All Grades</option>
                            {gradeOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <select
                            value={filters.class}
                            onChange={e => setFilters(f => ({ ...f, class: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All Classes</option>
                            {classOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={filters.date}
                            onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
                            className="border rounded px-2 py-1"
                            placeholder="Date"
                        />
                    </div>
                    <DataTable
                        columns={columns}
                        data={filteredFees}
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredFees.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        isLoading={userLoading || feesLoading}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Fees;