import React, { useState, useEffect } from 'react';
import supabase from '../../../db/SupaBaseConfig';

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

    useEffect(() => {
        fetchYearlyData();
    }, [selectedYear]);

    const fetchYearlyData = async () => {
        setLoading(true);
        try {
            const startDate = `${selectedYear}-01-01`;
            const endDate = `${selectedYear}-12-31`;

            // Fetch summary data
            const { data: levyUSD } = await supabase
                .from('levy_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);
            
            const { data: levyZWG } = await supabase
                .from('levy_zwg')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            // Fetch Tuition
            const { data: tuitionUSD } = await supabase
                .from('tuition_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: tuitionZWG } = await supabase
                .from('tuition_zwg')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);
            
            const { data: levyInUsd } = await supabase
                .from('levy_in_txn_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: levyInZwg } = await supabase
                .from('levy_in_txn_zwg')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);
            
            const { data: levyOutUsd } = await supabase
                .from('levy_out_txn_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate)
            
            const { data: levyOutZwg } = await supabase
                .from('levy_out_txn_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate)
            
            const { data: tuitionInUsd } = await supabase
                .from('tuition_in_txn_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: tuitionInZwg } = await supabase
                .from('tuition_in_txn_zwg')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: tuitionOutUsd } = await supabase
                .from('tuition_out_txn_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: tuitionOutZwg } = await supabase
                .from('tuition_out_txn_zwg')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);
            
            const { data: LevyRecoveriesUsd } = await supabase
                .from('levy_usd')
                .select('Amount')
                .eq('form', 'recovery')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: LevyRecoveriesZwg } = await supabase
                .from('levy_zwg')
                .select('Amount')
                .eq('form', 'recovery')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: LevyPrepaymentsUsd } = await supabase
                .from('levy_usd')
                .select('Amount')
                .eq('form', 'prepayment')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: LevyPrepaymentsZwg } = await supabase
                .from('levy_zwg')
                .select('Amount')
                .eq('form', 'prepayment')
                .gte('Date', startDate)
                .lte('Date', endDate);
            
            const { data: TuitionRecoveriesUsd } = await supabase
                .from('tuition_usd')
                .select('Amount')
                .eq('form', 'recovery')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: TuitionRecoveriesZwg } = await supabase
                .from('tuition_zwg')
                .select('Amount')
                .eq('form', 'recovery')
                .gte('Date', startDate)
                .lte('Date', endDate);
            
            const { data: TuitionPrepaymentsUsd } = await supabase
                .from('tuition_usd')
                .select('Amount')
                .eq('form', 'prepayment')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: TuitionPrepaymentsZwg } = await supabase
                .from('tuition_zwg')
                .select('Amount')
                .eq('form', 'prepayment')
                .gte('Date', startDate)
                .lte('Date', endDate);

            // Calculate totals
            setSummaryData({
                levyPayments: {
                    usd: levyUSD?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: levyZWG?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                },
                tuitionPayments: {
                    usd: tuitionUSD?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: tuitionZWG?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                },
                levyTxnIn: {
                    usd: levyInUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: levyInZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                },
                levyTxnOut: {
                    usd: levyOutUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: levyOutZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                },
                tuitionTxnIn: {
                    usd: tuitionInUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: tuitionInZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                },
                tuitionTxnOut: {
                    usd: tuitionOutUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: tuitionOutZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                }
            });

            setRecoveries({
                levyRecoveries: {
                    usd: LevyRecoveriesUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: LevyRecoveriesZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                },
                tuitionRecoveries: {
                    usd: TuitionRecoveriesUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: TuitionRecoveriesZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                }
            });

            setPrepayments({
                levyPrepayments: {
                    usd: LevyPrepaymentsUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: LevyPrepaymentsZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                },
                tuitionPrepayments: {
                    usd: TuitionPrepaymentsUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                    zwg: TuitionPrepaymentsZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
                }
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching yearly data:', error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Yearly Transactions Report</h2>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                >
                    {Array.from({ length: 5 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - i}>
                            {new Date().getFullYear() - i}
                        </option>
                    ))}
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-blue-700">Levy Txn In</h3>
                    <p className="text-sm">USD: ${summaryData.levyTxnIn.usd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${summaryData.levyTxnIn.zwg.toFixed(2)}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-red-700">Levy Txn Out</h3>
                    <p className="text-sm">USD: ${summaryData.levyTxnOut.usd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${summaryData.levyTxnOut.zwg.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-green-700">Tuition Txn In</h3>
                    <p className="text-sm">USD: ${summaryData.tuitionTxnIn.usd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${summaryData.tuitionTxnIn.zwg.toFixed(2)}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-yellow-700">Tuition Txn Out</h3>
                    <p className="text-sm">USD: ${summaryData.tuitionTxnOut.usd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${summaryData.tuitionTxnOut.zwg.toFixed(2)}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-purple-700">Levy Payments</h3>
                    <p className="text-sm">USD: ${summaryData.levyPayments.usd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${summaryData.levyPayments.zwg.toFixed(2)}</p>
                </div>
                <div className="bg-indigo-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-indigo-700">Tuition Payments</h3>
                    <p className="text-sm">USD: ${summaryData.tuitionPayments.usd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${summaryData.tuitionPayments.zwg.toFixed(2)}</p>
                </div>
            </div>

            {/* Transaction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Recoveries Cards */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Levy Recoveries</h3>
                    <div className="space-y-2">
                        <p className="text-lg">USD: ${recoveries.levyRecoveries.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${recoveries.levyRecoveries.zwg.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Tuition Recoveries</h3>
                    <div className="space-y-2">
                        <p className="text-lg">USD: ${recoveries.tuitionRecoveries.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${recoveries.tuitionRecoveries.zwg.toFixed(2)}</p>
                    </div>
                </div>

                {/* Prepayments Cards */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Levy Prepayments</h3>
                    <div className="space-y-2">
                        <p className="text-lg">USD: ${prepayments.levyPrepayments.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${prepayments.levyPrepayments.zwg.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Tuition Prepayments</h3>
                    <div className="space-y-2">
                        <p className="text-lg">USD: ${prepayments.tuitionPrepayments.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${prepayments.tuitionPrepayments.zwg.toFixed(2)}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default YearlyReport;