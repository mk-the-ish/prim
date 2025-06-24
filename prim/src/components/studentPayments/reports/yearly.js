import React, { useState, useEffect } from 'react';
import { fetchFees, fetchLevyUSD, fetchLevyZWG, fetchTuitionUSD, fetchTuitionZWG } from '../../api/viewPaymentsApi';
import ReportCard from '../../ui/reportCard';
import Card from '../../ui/card';
import Loader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import SummaryCard from '../../ui/summaryCard';

const YearlyReport = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [summaryData, setSummaryData] = useState({
        levyTxnIn: { usd: 0, zwg: 0 },
        levyTxnOut: { usd: 0, zwg: 0 },
        tuitionTxnIn: { usd: 0, zwg: 0 },
        tuitionTxnOut: { usd: 0, zwg: 0 },
        levyPayments: { usd: 0, zwg: 0 },
        tuitionPayments: { usd: 0, zwg: 0 }
    });
    const [recoveries, setRecoveries] = useState({
        levyRecoveries: { usd: 0, zwg: 0 },
        tuitionRecoveries: { usd: 0, zwg: 0 },
    });
    const [prepayments, setPrepayments] = useState({
        levyPrepayments: { usd: 0, zwg: 0 },
        tuitionPrepayments: { usd: 0, zwg: 0 },
    });
    const [loading, setLoading] = useState(true);

    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    useEffect(() => {
        fetchYearlyData();
        // eslint-disable-next-line
    }, [selectedYear]);

    const fetchYearlyData = async () => {
        setLoading(true);
        try {
            const startDate = `${selectedYear}-01-01`;
            const endDate = `${selectedYear}-12-31`;

            // Fetch all Fees for the year
            const [fees] = await Promise.all([
                fetchFees(),
            ]);
            // Both fetchLevyUSD and fetchLevyZWG fetch all Fees, so we can filter by Type and Currency

            // USD
            const usdFees = fees.filter(
                f =>
                    f.Currency === 'usd' &&
                    f.Date >= startDate &&
                    f.Date <= endDate
            );
            // ZWG
            const zwgFees = fees.filter(
                f =>
                    f.Currency === 'zwg' &&
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
            setSummaryData({
                levyPayments: {
                    usd: levyUSD.reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                    zwg: levyZWG.reduce((sum, txn) => sum + (txn.Amount || 0), 0)
                },
                tuitionPayments: {
                    usd: tuitionUSD.reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                    zwg: tuitionZWG.reduce((sum, txn) => sum + (txn.Amount || 0), 0)
                },
                levyTxnIn: {
                    usd: levyUSD.filter(f => f.Amount > 0).reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                    zwg: levyZWG.filter(f => f.Amount > 0).reduce((sum, txn) => sum + (txn.Amount || 0), 0)
                },
                levyTxnOut: {
                    usd: levyUSD.filter(f => f.Amount < 0).reduce((sum, txn) => sum + Math.abs(txn.Amount || 0), 0),
                    zwg: levyZWG.filter(f => f.Amount < 0).reduce((sum, txn) => sum + Math.abs(txn.Amount || 0), 0)
                },
                tuitionTxnIn: {
                    usd: tuitionUSD.filter(f => f.Amount > 0).reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                    zwg: tuitionZWG.filter(f => f.Amount > 0).reduce((sum, txn) => sum + (txn.Amount || 0), 0)
                },
                tuitionTxnOut: {
                    usd: tuitionUSD.filter(f => f.Amount < 0).reduce((sum, txn) => sum + Math.abs(txn.Amount || 0), 0),
                    zwg: tuitionZWG.filter(f => f.Amount < 0).reduce((sum, txn) => sum + Math.abs(txn.Amount || 0), 0)
                }
            });

            setRecoveries({
                levyRecoveries: {
                    usd: levyUSD.filter(f => f.form === 'recovery').reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                    zwg: levyZWG.filter(f => f.form === 'recovery').reduce((sum, txn) => sum + (txn.Amount || 0), 0)
                },
                tuitionRecoveries: {
                    usd: tuitionUSD.filter(f => f.form === 'recovery').reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                    zwg: tuitionZWG.filter(f => f.form === 'recovery').reduce((sum, txn) => sum + (txn.Amount || 0), 0)
                }
            });

            setPrepayments({
                levyPrepayments: {
                    usd: levyUSD.filter(f => f.form === 'prepayment').reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                    zwg: levyZWG.filter(f => f.form === 'prepayment').reduce((sum, txn) => sum + (txn.Amount || 0), 0)
                },
                tuitionPrepayments: {
                    usd: tuitionUSD.filter(f => f.form === 'prepayment').reduce((sum, txn) => sum + (txn.Amount || 0), 0),
                    zwg: tuitionZWG.filter(f => f.form === 'prepayment').reduce((sum, txn) => sum + (txn.Amount || 0), 0)
                }
            });

            setLoading(false);
        } catch (error) {
            addToast('Error fetching yearly data', 'error');
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
                title="Yearly Transactions Report"
                headerAction={
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        style={{
                            background: currentTheme.background?.paper,
                            color: currentTheme.text?.primary,
                            borderColor: currentTheme.divider
                        }}
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i} value={new Date().getFullYear() - i}>
                                {new Date().getFullYear() - i}
                            </option>
                        ))}
                    </select>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <ReportCard
                        title="Levy Txn In"
                        data={summaryData.levyTxnIn}
                    />
                    <ReportCard
                        title="Levy Txn Out"
                        data={summaryData.levyTxnOut}
                        variant="secondary"
                    />
                    <ReportCard
                        title="Tuition Txn In"
                        data={summaryData.tuitionTxnIn}
                    />
                    <ReportCard
                        title="Tuition Txn Out"
                        data={summaryData.tuitionTxnOut}
                        variant="secondary"
                    />
                    <ReportCard
                        title="Levy Payments"
                        data={summaryData.levyPayments}
                    />
                    <ReportCard
                        title="Tuition Payments"
                        data={summaryData.tuitionPayments}
                        variant="secondary"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard title="Levy Recoveries" icon={null} bgColor="bg-green-100">
                        <div className="space-y-2">
                            <p className="text-lg">USD: ${recoveries.levyRecoveries.usd.toFixed(2)}</p>
                            <p className="text-lg">ZWG: ${recoveries.levyRecoveries.zwg.toFixed(2)}</p>
                        </div>
                    </SummaryCard>
                    <SummaryCard title="Tuition Recoveries" icon={null} bgColor="bg-blue-100">
                        <div className="space-y-2">
                            <p className="text-lg">USD: ${recoveries.tuitionRecoveries.usd.toFixed(2)}</p>
                            <p className="text-lg">ZWG: ${recoveries.tuitionRecoveries.zwg.toFixed(2)}</p>
                        </div>
                    </SummaryCard>
                    <SummaryCard title="Levy Prepayments" icon={null} bgColor="bg-yellow-100">
                        <div className="space-y-2">
                            <p className="text-lg">USD: ${prepayments.levyPrepayments.usd.toFixed(2)}</p>
                            <p className="text-lg">ZWG: ${prepayments.levyPrepayments.zwg.toFixed(2)}</p>
                        </div>
                    </SummaryCard>
                    <SummaryCard title="Tuition Prepayments" icon={null} bgColor="bg-purple-100">
                        <div className="space-y-2">
                            <p className="text-lg">USD: ${prepayments.tuitionPrepayments.usd.toFixed(2)}</p>
                            <p className="text-lg">ZWG: ${prepayments.tuitionPrepayments.zwg.toFixed(2)}</p>
                        </div>
                    </SummaryCard>
                </div>
            </Card>
        </div>
    );
};

export default YearlyReport;