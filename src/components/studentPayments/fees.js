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
        feesType: '',
        grade: '',
        class: '',
        date: '',
        accountId: ''
    });
    const [accountOptions, setAccountOptions] = useState([]);

    // Fetch user data
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login')
    });

    // Fetch fees data
    const { data: fees = [], isLoading: feesLoading } = useQuery({
        queryKey: ['fees'],
        queryFn: fetchFees,
        enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role)
    });

    // Fetch account options for filter
    useEffect(() => {
        if (accountOptions.length === 0) {
            import('../../db/SupaBaseConfig').then(({ default: supabase }) => {
                supabase
                    .from('Accounts')
                    .select('id, accNumber, bank, branch, currency')
                    .then(({ data }) => {
                        if (data) setAccountOptions(data);
                    });
            });
        }
    }, [accountOptions.length]);

    // Filter logic
    const filteredFees = fees.filter(fee => {
        const matchesCurrency = filters.currency ? fee.currency === filters.currency : true;
        const matchesType = filters.feesType ? String(fee.feesType) === filters.feesType : true;
        const matchesGrade = filters.grade ? fee.Students?.grade === filters.grade : true;
        const matchesClass = filters.class ? fee.Students?.class === filters.class : true;
        const matchesDate = filters.date ? fee.created_at?.slice(0, 10) === filters.date : true;
        const matchesAccount = filters.accountId
            ? String(fee.accountId) === filters.accountId
            : true;
        return matchesCurrency && matchesType && matchesGrade && matchesClass && matchesDate && matchesAccount;
    });

    // Pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedFees = filteredFees.slice(startIndex, endIndex);

    // Collect unique values for filter dropdowns
    const currencyOptions = [...new Set(fees.map(fee => fee.currency).filter(Boolean))];
    const feesTypeOptions = [...new Set(fees.map(fee => fee.feesType).filter(Boolean))];
    const gradeOptions = [...new Set(fees.map(fee => fee.Students?.grade).filter(Boolean))];
    const classOptions = [...new Set(fees.map(fee => fee.Students?.class).filter(Boolean))];

    const columns = [
        {
            header: 'Student Name',
            render: (row) => row.Students ? `${row.Students.firstNames} ${row.Students.surname}` : 'N/A'
        },
        { header: 'Grade', render: (row) => row.Students?.grade || 'N/A' },
        { header: 'Class', render: (row) => row.Students?.class || 'N/A' },
        { header: 'Gender', render: (row) => row.Students?.gender || 'N/A' },
        { header: 'Date', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A' },
        { header: 'Amount', accessor: 'amount', render: row => row.amount ? `$${row.amount.toFixed(2)}` : 'N/A' },
        { header: 'Type', accessor: 'feesType' },
        { header: 'Form', accessor: 'paymentForm' },
        { header: 'Currency', accessor: 'currency' },
        { header: 'Receipt Number', accessor: 'receiptNumber' },
        {
            header: 'Account',
            render: row => {
                if (row.Accounts) {
                    return `${row.Accounts.bank} - ${row.Accounts.branch} - ${row.Accounts.accNumber} (${row.Accounts.currency})`;
                }
                return row.accountId || 'N/A';
            }
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <TopBar title="Fees Table" userName={userData?.name} />
            <div className="p-6">
                <Card title="Fees" className="mb-4">
                    <div className="flex flex-wrap gap-4 mb-4">
                        <select
                            value={filters.accountId}
                            onChange={e => setFilters(f => ({ ...f, accountId: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All Accounts</option>
                            {accountOptions.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.bank} - {acc.branch} - {acc.accNumber} ({acc.currency})
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
                            value={filters.feesType}
                            onChange={e => setFilters(f => ({ ...f, feesType: e.target.value }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">All Types</option>
                            {feesTypeOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
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
                        data={paginatedFees}
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