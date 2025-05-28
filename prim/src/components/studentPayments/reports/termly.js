import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';

const TermlyReport = () => {
    const [levyTxnIn, setLevyTxnIn] = useState({ usd: 0, zwg: 0 });
    const [levyTxnOut, setLevyTxnOut] = useState({ usd: 0, zwg: 0 });
    const [tuitionTxnIn, setTuitionTxnIn] = useState({ usd: 0, zwg: 0 });
    const [tuitionTxnOut, setTuitionTxnOut] = useState({ usd: 0, zwg: 0 });
    const [Levy, setLevy] = useState({ usd: 0, zwg: 0 });
    const [Tuition, setTuition] = useState({ usd: 0, zwg: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedTerm, setSelectedTerm] = useState('1'); // Default to First Term
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const terms = [
        { id: '1', label: 'First Term', startDate: '-01-01', endDate: '-04-30' },
        { id: '2', label: 'Second Term', startDate: '-05-01', endDate: '-08-31' },
        { id: '3', label: 'Third Term', startDate: '-09-01', endDate: '-12-31' }
    ];

    useEffect(() => {
        if (selectedTerm && selectedYear) {
            fetchTermlyTransactions();
        }
    }, [selectedTerm, selectedYear]);

    const fetchTermlyTransactions = async () => {
        setLoading(true);
        try {
            const term = terms.find(t => t.id === selectedTerm);
            const startDate = `${selectedYear}${term.startDate}`;
            const endDate = `${selectedYear}${term.endDate}`;

            // Fetch Levy
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

            // Fetch all transactions
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
                zwg: levyInZwg?.reduce((sum, txn) => sum + (txn.USD_equivalent || 0), 0) || 0
            });

            setLevyTxnOut({
                usd: levyOutUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                zwg: levyOutZwg?.reduce((sum, txn) => sum + (txn.USD_equivalent || 0), 0) || 0
            });

            setTuitionTxnIn({
                usd: tuitionInUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                zwg: tuitionInZwg?.reduce((sum, txn) => sum + (txn.USD_equivalent || 0), 0) || 0
            });

            setTuitionTxnOut({
                usd: tuitionOutUsd?.reduce((sum, txn) => sum + (txn.Amount || 0), 0) || 0,
                zwg: tuitionOutZwg?.reduce((sum, txn) => sum + (txn.USD_equivalent || 0), 0) || 0
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching termly transactions:', error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Termly Transactions Report</h2>
                <div className="flex gap-4">
                    <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        {terms.map(term => (
                            <option key={term.id} value={term.id}>
                                {term.label}
                            </option>
                        ))}
                    </select>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Levy Transaction In */}
                <div className="bg-blue-100 p-6 rounded-lg shadow-lg border border-blue-300">
                    <h3 className="text-xl font-bold mb-4 text-blue-600">Levy Txn In</h3>
                    <div className="mt-4">
                        <p className="text-lg">USD: ${levyTxnIn.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${levyTxnIn.zwg.toFixed(2)}</p>
                    </div>
                </div>

                {/* Levy Transaction Out */}
                <div className="bg-blue-150 p-6 rounded-lg shadow-lg border border-blue-400">
                    <h3 className="text-xl font-bold mb-4 text-blue-600">Levy Txn Out</h3>
                    <div className="mt-4">
                        <p className="text-lg">USD: ${levyTxnOut.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${levyTxnOut.zwg.toFixed(2)}</p>
                    </div>
                </div>

                {/* Tuition Transaction In */}
                <div className="bg-blue-100 p-6 rounded-lg shadow-lg border border-blue-500">
                    <h3 className="text-xl font-bold mb-4 text-blue-600">Tuition Txn In</h3>
                    <div className="mt-4">
                        <p className="text-lg">USD: ${tuitionTxnIn.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${tuitionTxnIn.zwg.toFixed(2)}</p>
                    </div>
                </div>

                {/* Tuition Transaction Out */}
                <div className="bg-blue-150 p-6 rounded-lg shadow-lg border border-blue-600">
                    <h3 className="text-xl font-bold mb-4 text-blue-600">Tuition Txn Out</h3>
                    <div className="mt-4">
                        <p className="text-lg">USD: ${tuitionTxnOut.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${tuitionTxnOut.zwg.toFixed(2)}</p>
                    </div>
                </div>

                {/* Total Levy */}
                <div className="bg-blue-100 p-6 rounded-lg shadow-lg border border-blue-700">
                    <h3 className="text-xl font-bold mb-4 text-blue-600">Levy</h3>
                    <div className="mt-4">
                        <p className="text-lg">USD: ${Levy.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${Levy.zwg.toFixed(2)}</p>
                    </div>
                </div>

                {/* Total Tuition */}
                <div className="bg-blue-150 p-6 rounded-lg shadow-lg border border-blue-800">
                    <h3 className="text-xl font-bold mb-4 text-blue-700">Tuition</h3>
                    <div className="mt-4">
                        <p className="text-lg">USD: ${Tuition.usd.toFixed(2)}</p>
                        <p className="text-lg">ZWG: ${Tuition.zwg.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermlyReport;