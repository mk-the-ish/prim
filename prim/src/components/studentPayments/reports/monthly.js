import React, { useState, useEffect } from 'react';
import supabase from '../../../db/SupaBaseConfig';
import ReportCard from '../../ui/reportCard';
import Card from '../../ui/card';

const MonthlyReport = () => {
    const [levyTxnIn, setLevyTxnIn] = useState({ usd: 0, zwg: 0 });
    const [levyTxnOut, setLevyTxnOut] = useState({ usd: 0, zwg: 0 });
    const [tuitionTxnIn, setTuitionTxnIn] = useState({ usd: 0, zwg: 0 });
    const [tuitionTxnOut, setTuitionTxnOut] = useState({ usd: 0, zwg: 0 });
    const [Levy, setLevy] = useState({ usd: 0, zwg: 0 });
    const [Tuition, setTuition] = useState({ usd: 0, zwg: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

    useEffect(() => {
        fetchMonthlyTransactions();
    }, [selectedMonth]);

    const fetchMonthlyTransactions = async () => {
        setLoading(true);
        try {
            const startDate = `${selectedMonth}-01`;
            const endDate = new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1], 0).toISOString().split('T')[0];

            //Fetch Levy
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

            // Fetch Levy Transactions In
            const { data: levyInUsd } = await supabase
                .from('levy_in_txn_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: levyInZwg } = await supabase
                .from('levy_in_txn_zwg')
                .select('Amount, USD_equivalent')
                .gte('Date', startDate)
                .lte('Date', endDate);

            // Fetch Levy Transactions Out
            const { data: levyOutUsd } = await supabase
                .from('levy_out_txn_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: levyOutZwg } = await supabase
                .from('levy_out_txn_zwg')
                .select('Amount, USD_equivalent')
                .gte('Date', startDate)
                .lte('Date', endDate);

            // Fetch Tuition Transactions In
            const { data: tuitionInUsd } = await supabase
                .from('tuition_in_txn_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: tuitionInZwg } = await supabase
                .from('tuition_in_txn_zwg')
                .select('Amount, USD_equivalent')
                .gte('Date', startDate)
                .lte('Date', endDate);

            // Fetch Tuition Transactions Out
            const { data: tuitionOutUsd } = await supabase
                .from('tuition_out_txn_usd')
                .select('Amount')
                .gte('Date', startDate)
                .lte('Date', endDate);

            const { data: tuitionOutZwg } = await supabase
                .from('tuition_out_txn_zwg')
                .select('Amount, USD_equivalent')
                .gte('Date', startDate)
                .lte('Date', endDate);

            // Calculate totals
            setLevy({
                usd: levyUSD?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                zwg: levyZWG?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
            });

            setTuition({
                usd: tuitionUSD?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                zwg: tuitionZWG?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
            });

            setLevyTxnIn({
                usd: levyInUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                zwg: levyInZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
            });

            setLevyTxnOut({
                usd: levyOutUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                zwg: levyOutZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
            });

            setTuitionTxnIn({
                usd: tuitionInUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                zwg: tuitionInZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
            });

            setTuitionTxnOut({
                usd: tuitionOutUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                zwg: tuitionOutZwg?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching monthly transactions:', error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

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