import React, { useState, useEffect } from 'react';
import { fetchFees, fetchLevyUSD, fetchLevyZWG, fetchTuitionUSD, fetchTuitionZWG } from '../../api/viewPaymentsApi';
import ReportCard from '../../ui/reportCard';
import Card from '../../ui/card';
import Loader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';

const MonthlyReport = () => {
    const [levyTxnIn, setLevyTxnIn] = useState({ usd: 0, zwg: 0 });
    const [levyTxnOut, setLevyTxnOut] = useState({ usd: 0, zwg: 0 });
    const [tuitionTxnIn, setTuitionTxnIn] = useState({ usd: 0, zwg: 0 });
    const [tuitionTxnOut, setTuitionTxnOut] = useState({ usd: 0, zwg: 0 });
    const [Levy, setLevy] = useState({ usd: 0, zwg: 0 });
    const [Tuition, setTuition] = useState({ usd: 0, zwg: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    useEffect(() => {
        fetchMonthlyTransactions();
        // eslint-disable-next-line
    }, [selectedMonth]);

    const fetchMonthlyTransactions = async () => {
        setLoading(true);
        try {
            const startDate = `${selectedMonth}-01`;
            const endDate = new Date(
                selectedMonth.split('-')[0],
                selectedMonth.split('-')[1],
                0
            )
                .toISOString()
                .split('T')[0];

            // Fetch all Fees for the month
            const [fees] = await Promise.all([
                fetchFees(),
            ]);
            // Both fetchLevyUSD and fetchLevyZWG fetch all Fees, so we can filter by Type and Currency

            // USD
            const usdFees = fees.filter(
                f =>
                    f.Currency === 'USD' &&
                    f.Date >= startDate &&
                    f.Date <= endDate
            );
            // ZWG
            const zwgFees = fees.filter(
                f =>
                    f.Currency === 'ZWG' &&
                    f.Date >= startDate &&
                    f.Date <= endDate
            );

            // Levy USD
            const levyUSD = usdFees.filter(f => f.Type === 'Levy');
            // Levy ZWG
            const levyZWG = zwgFees.filter(f => f.Type === 'Levy');
            // Tuition USD
            const tuitionUSD = usdFees.filter(f => f.Type === 'Tuition');
            // Tuition ZWG
            const tuitionZWG = zwgFees.filter(f => f.Type === 'Tuition');

            // Totals
            setLevy({
                usd: levyUSD.reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                zwg: levyZWG.reduce((sum, txn) => sum + (txn.Amount || 0), 0)
            });
            setTuition({
                usd: tuitionUSD.reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                zwg: tuitionZWG.reduce((sum, txn) => sum + (txn.Amount || 0), 0)
            });

            // Transactions In/Out
            setLevyTxnIn({
                usd: levyUSD
                    .filter(f => f.Amount > 0)
                    .reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                zwg: levyZWG
                    .filter(f => f.Amount > 0)
                    .reduce((sum, txn) => sum + (txn.Amount || 0), 0)
            });
            setLevyTxnOut({
                usd: levyUSD
                    .filter(f => f.Amount < 0)
                    .reduce((sum, txn) => sum + Math.abs(txn.Amount || 0), 0),
                zwg: levyZWG
                    .filter(f => f.Amount < 0)
                    .reduce((sum, txn) => sum + Math.abs(txn.Amount || 0), 0)
            });
            setTuitionTxnIn({
                usd: tuitionUSD
                    .filter(f => f.Amount > 0)
                    .reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                zwg: tuitionZWG
                    .filter(f => f.Amount > 0)
                    .reduce((sum, txn) => sum + (txn.Amount || 0), 0)
            });
            setTuitionTxnOut({
                usd: tuitionUSD
                    .filter(f => f.Amount < 0)
                    .reduce((sum, txn) => sum + Math.abs(txn.Amount || 0), 0),
                zwg: tuitionZWG
                    .filter(f => f.Amount < 0)
                    .reduce((sum, txn) => sum + Math.abs(txn.Amount || 0), 0)
            });

            setLoading(false);
        } catch (error) {
            addToast('Error fetching monthly transactions', 'error');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]" style={{ background: currentTheme.background?.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card
                title="Monthly Transactions Report"
                headerAction={
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        style={{
                            background: currentTheme.background?.paper,
                            color: currentTheme.text?.primary,
                            borderColor: currentTheme.divider
                        }}
                    />
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ReportCard
                        title="Levy Txn In"
                        data={{ usd: levyTxnIn.usd, zwg: levyTxnIn.zwg }}
                    />
                    <ReportCard
                        title="Levy Txn Out"
                        data={{ usd: levyTxnOut.usd, zwg: levyTxnOut.zwg }}
                        variant="secondary"
                    />
                    <ReportCard
                        title="Tuition Txn In"
                        data={{ usd: tuitionTxnIn.usd, zwg: tuitionTxnIn.zwg }}
                    />
                    <ReportCard
                        title="Tuition Txn Out"
                        data={{ usd: tuitionTxnOut.usd, zwg: tuitionTxnOut.zwg }}
                        variant="secondary"
                    />
                    <ReportCard
                        title="Total Levy"
                        data={{ usd: Levy.usd, zwg: Levy.zwg }}
                    />
                    <ReportCard
                        title="Total Tuition"
                        data={{ usd: Tuition.usd, zwg: Tuition.zwg }}
                        variant="secondary"
                    />
                </div>
            </Card>
        </div>
    );
};

export default MonthlyReport;