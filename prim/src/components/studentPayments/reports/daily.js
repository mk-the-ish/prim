import React, { useState, useEffect } from 'react';
import { fetchLevyUSD, fetchLevyZWG, fetchTuitionUSD, fetchTuitionZWG, fetchCommissionsIn, fetchCommissionsOut } from '../../api/viewPaymentsApi';
import Card from '../../ui/card';
import SummaryCard from '../../ui/summaryCard';
import ReportCard from '../../ui/reportCard';
import DataTable from '../../ui/dataTable';
import Loader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';

const DailyReport = () => {
    const [levyUsdTransactions, setLevyUsdTransactions] = useState([]);
    const [levyZwgTransactions, setLevyZwgTransactions] = useState([]);
    const [tuitionUsdTransactions, setTuitionUsdTransactions] = useState([]);
    const [tuitionZwgTransactions, setTuitionZwgTransactions] = useState([]);
    const [commissionIn, setCommissionIn] = useState([]);
    const [commissionOut, setCommissionOut] = useState([]);
    const [loading, setLoading] = useState(true);

    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    useEffect(() => {
        fetchDailyTransactions();
        // eslint-disable-next-line
    }, []);

    const fetchDailyTransactions = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            // Fetch all payments and commissions for today
            const [
                allLevyUSD,
                allLevyZWG,
                allTuitionUSD,
                allTuitionZWG,
                allCommissionIn,
                allCommissionOut
            ] = await Promise.all([
                fetchLevyUSD(),
                fetchLevyZWG(),
                fetchTuitionUSD(),
                fetchTuitionZWG(),
                fetchCommissionsIn(),
                fetchCommissionsOut()
            ]);

            setLevyUsdTransactions(allLevyUSD.filter(txn => txn.Date === today && txn.Type === 'Levy' && txn.Currency === 'USD'));
            setLevyZwgTransactions(allLevyZWG.filter(txn => txn.Date === today && txn.Type === 'Levy' && txn.Currency === 'ZWG'));
            setTuitionUsdTransactions(allTuitionUSD.filter(txn => txn.Date === today && txn.Type === 'Tuition' && txn.Currency === 'USD'));
            setTuitionZwgTransactions(allTuitionZWG.filter(txn => txn.Date === today && txn.Type === 'Tuition' && txn.Currency === 'ZWG'));
            setCommissionIn(allCommissionIn.filter(txn => txn.Date === today));
            setCommissionOut(allCommissionOut.filter(txn => txn.Date === today));

            setLoading(false);
        } catch (error) {
            addToast('Error fetching daily transactions.', 'error');
            setLoading(false);
        }
    };

    // Calculate totals
    const sumAmount = arr => arr.reduce((sum, txn) => sum + (txn.Amount || 0), 0);
    const sumUSD = arr => arr.reduce((sum, txn) => sum + (txn.USD_equivalent || 0), 0);

    const commissionInTotal = sumAmount(commissionIn);
    const commissionOutTotal = sumAmount(commissionOut);
    const levyUsdTotal = sumAmount(levyUsdTransactions);
    const levyZwgTotal = sumAmount(levyZwgTransactions);
    const levyZwgUsdEq = sumUSD(levyZwgTransactions);
    const tuitionUsdTotal = sumAmount(tuitionUsdTransactions);
    const tuitionZwgTotal = sumAmount(tuitionZwgTransactions);
    const tuitionZwgUsdEq = sumUSD(tuitionZwgTransactions);

    // Table columns
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Date', render: row => new Date(row.Date).toLocaleDateString() },
        { header: 'Student', render: row => row.Students ? `${row.Students.FirstNames} ${row.Students.Surname}` : '-' },
        { header: 'Type', accessor: 'Type' },
        { header: 'Currency', accessor: 'Currency' },
        { header: 'Amount', render: row => `$${Number(row.Amount).toFixed(2)}` },
        { header: 'USD Equivalent', render: row => row.USD_equivalent ? `$${Number(row.USD_equivalent).toFixed(2)}` : '-' },
        { header: 'Reference', accessor: 'reference' },
        { header: 'Description', accessor: 'Description' },
    ];

    const commissionColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Date', render: row => new Date(row.Date).toLocaleDateString() },
        { header: 'Payee', accessor: 'Payee' },
        { header: 'Amount', render: row => `$${Number(row.Amount).toFixed(2)}` },
        { header: 'Description', accessor: 'Description' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background?.default }}>
                <Loader type="card" count={2} />
            </div>
        );
    }

    return (
        <div className="p-6" style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}>
            <h2 className="text-3xl font-bold mb-6 text-center">Daily Transactions Report</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <SummaryCard title="Commission In" icon={null} bgColor="bg-blue-100">
                    <p className="text-xl font-semibold" style={{ color: currentTheme.text.primary }}>${commissionInTotal.toFixed(2)}</p>
                </SummaryCard>
                <SummaryCard title="Commission Out" icon={null} bgColor="bg-red-100">
                    <p className="text-xl font-semibold" style={{ color: currentTheme.text.primary }}>${commissionOutTotal.toFixed(2)}</p>
                </SummaryCard>
                <SummaryCard title="Levy USD" icon={null} bgColor="bg-green-100">
                    <p className="text-xl font-semibold" style={{ color: currentTheme.text.primary }}>${levyUsdTotal.toFixed(2)}</p>
                </SummaryCard>
                <SummaryCard title="Levy ZWG" icon={null} bgColor="bg-yellow-100">
                    <p className="text-sm" style={{ color: currentTheme.text.primary }}>ZWG: ${levyZwgTotal.toFixed(2)}</p>
                    <p className="text-sm" style={{ color: currentTheme.text.primary }}>USD Eq: ${levyZwgUsdEq.toFixed(2)}</p>
                </SummaryCard>
                <SummaryCard title="Tuition USD" icon={null} bgColor="bg-purple-100">
                    <p className="text-xl font-semibold" style={{ color: currentTheme.text.primary }}>${tuitionUsdTotal.toFixed(2)}</p>
                </SummaryCard>
                <SummaryCard title="Tuition ZWG" icon={null} bgColor="bg-indigo-100">
                    <p className="text-sm" style={{ color: currentTheme.text.primary }}>ZWG: ${tuitionZwgTotal.toFixed(2)}</p>
                    <p className="text-sm" style={{ color: currentTheme.text.primary }}>USD Eq: ${tuitionZwgUsdEq.toFixed(2)}</p>
                </SummaryCard>
            </div>

            {/* Detailed Tables */}
            <div className="flex flex-col lg:flex-row gap-6">
                <Card title="USD Transactions" className="w-full lg:w-1/2" variant="primary">
                    <ReportCard
                        title="Levy USD"
                        data={{ USD: levyUsdTotal }}
                        variant="default"
                    />
                    <div className="mt-4">
                        <DataTable
                            columns={columns}
                            data={levyUsdTransactions}
                            currentPage={1}
                            totalPages={1}
                            itemsPerPage={levyUsdTransactions.length}
                            onPageChange={() => {}}
                        />
                    </div>
                    <ReportCard
                        title="Tuition USD"
                        data={{ USD: tuitionUsdTotal }}
                        variant="default"
                    />
                    <div className="mt-4">
                        <DataTable
                            columns={columns}
                            data={tuitionUsdTransactions}
                            currentPage={1}
                            totalPages={1}
                            itemsPerPage={tuitionUsdTransactions.length}
                            onPageChange={() => {}}
                        />
                    </div>
                </Card>

                <Card title="ZWG Transactions" className="w-full lg:w-1/2" variant="secondary">
                    <ReportCard
                        title="Levy ZWG"
                        data={{ ZWG: levyZwgTotal, USD: levyZwgUsdEq }}
                        variant="secondary"
                    />
                    <div className="mt-4">
                        <DataTable
                            columns={columns}
                            data={levyZwgTransactions}
                            currentPage={1}
                            totalPages={1}
                            itemsPerPage={levyZwgTransactions.length}
                            onPageChange={() => {}}
                        />
                    </div>
                    <ReportCard
                        title="Tuition ZWG"
                        data={{ ZWG: tuitionZwgTotal, USD: tuitionZwgUsdEq }}
                        variant="secondary"
                    />
                    <div className="mt-4">
                        <DataTable
                            columns={columns}
                            data={tuitionZwgTransactions}
                            currentPage={1}
                            totalPages={1}
                            itemsPerPage={tuitionZwgTransactions.length}
                            onPageChange={() => {}}
                        />
                    </div>
                </Card>
            </div>

            {/* Commissions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card title="Commission In" variant="primary">
                    <DataTable
                        columns={commissionColumns}
                        data={commissionIn}
                        currentPage={1}
                        totalPages={1}
                        itemsPerPage={commissionIn.length}
                        onPageChange={() => {}}
                    />
                </Card>
                <Card title="Commission Out" variant="secondary">
                    <DataTable
                        columns={commissionColumns}
                        data={commissionOut}
                        currentPage={1}
                        totalPages={1}
                        itemsPerPage={commissionOut.length}
                        onPageChange={() => {}}
                    />
                </Card>
            </div>
        </div>
    );
};

export default DailyReport;


