import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';

const DailyReport = () => {
    const [levyUsdTransactions, setLevyUsdTransactions] = useState([]);
    const [levyZwgTransactions, setLevyZwgTransactions] = useState([]);
    const [tuitionUsdTransactions, setTuitionUsdTransactions] = useState([]);
    const [tuitionZwgTransactions, setTuitionZwgTransactions] = useState([]);
    const [LevyTotal, setLevyTotal] = useState(0);
    const [TuitionTotal, setTuitionTotal] = useState(0);
    const [commissionIn, setCommissionIn] = useState(0);
    const [commissionOut, setCommissionOut] = useState(0);
    const [levyTxnInUsd, setLevyTxnInUsd] = useState(0);
    const [levyTxnInZwg, setLevyTxnInZwg] = useState(0);
    const [levyTxnOutUsd, setLevyTxnOutUsd] = useState(0);
    const [levyTxnOutZwg, setLevyTxnOutZwg] = useState(0);
    const [tuitionTxnInUsd, setTuitionTxnInUsd] = useState(0);
    const [tuitionTxnInZwg, setTuitionTxnInZwg] = useState(0);
    const [tuitionTxnOutUsd, setTuitionTxnOutUsd] = useState(0);
    const [tuitionTxnOutZwg, setTuitionTxnOutZwg] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyTransactions();
    }, []);

    const fetchDailyTransactions = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            // Fetch Levy USD Transactions
            const { data: levyUsdData, error: levyUsdError } = await supabase
                .from('levy_usd')
                .select('*')
                .eq('Date', today)
                .eq('transaction_type', 'cash');
            if (levyUsdError) throw levyUsdError;
            setLevyUsdTransactions(levyUsdData || []);

            // Fetch Levy ZWG Transactions
            const { data: levyZwgData, error: levyZwgError } = await supabase
                .from('levy_zwg')
                .select('*')
                .eq('Date', today);
            if (levyZwgError) throw levyZwgError;
            setLevyZwgTransactions(levyZwgData || []);

            // Fetch Tuition USD Transactions
            const { data: tuitionUsdData, error: tuitionUsdError } = await supabase
                .from('tuition_usd')
                .select('*')
                .eq('Date', today)
                .eq('transaction_type', 'cash');
            if (tuitionUsdError) throw tuitionUsdError;
            setTuitionUsdTransactions(tuitionUsdData || []);

            // Fetch Tuition ZWG Transactions
            const { data: tuitionZwgData, error: tuitionZwgError } = await supabase
                .from('tuition_zwg')
                .select('*')
                .eq('Date', today);
            if (tuitionZwgError) throw tuitionZwgError;
            setTuitionZwgTransactions(tuitionZwgData || []);

            // Fetch Commission In Transactions
            const { data: commissionInData, error: commissionInError } = await supabase
                .from('commission_in')
                .select('*')
                .eq('Date', today);
            if (commissionInError) throw commissionInError;
            setCommissionIn(commissionInData || []);

            // Fetch Commission Out Transactions
            const { data: commissionOutData, error: commissionOutError } = await supabase
                .from('commission_out')
                .select('*')
                .eq('Date', today);
            if (commissionOutError) throw commissionOutError;
            setCommissionOut(commissionOutData || []);

            // Fetch Levy Transactions In USD
            const { data: levyTxnInUsdData, error: levyTxnInUsdError } = await supabase
                .from('levy_in_txn_usd')
                .select('*')
                .eq('Date', today);
            if (levyTxnInUsdError) throw levyTxnInUsdError;
            setLevyTxnInUsd(levyTxnInUsdData || []);

            // Fetch Levy Transactions In ZWG
            const { data: levyTxnInZwgData, error: levyTxnInZwgError } = await supabase
                .from('levy_in_txn_zwg')
                .select('*')
                .eq('Date', today);
            if (levyTxnInZwgError) throw levyTxnInZwgError;
            setLevyTxnInZwg(levyTxnInZwgData || []);

            //Fetch Levy Transactions Out USD
            const { data: levyTxnOutUsdData, error: levyTxnOutUsdError } = await supabase
                .from('levy_out_txn_usd')
                .select('*')
                .eq('Date', today);
            if (levyTxnOutUsdError) throw levyTxnOutUsdError;
            setLevyTxnOutUsd(levyTxnOutUsdData || []);

            // Fetch Levy Transactions Out ZWG
            const { data: levyTxnOutZwgData, error: levyTxnOutZwgError } = await supabase
                .from('levy_out_txn_zwg')
                .select('*')
                .eq('Date', today);
            if (levyTxnOutZwgError) throw levyTxnOutZwgError;
            setLevyTxnOutZwg(levyTxnOutZwgData || []);

            // Fetch Tuition Transactions In USD
            const { data: tuitionTxnInUsdData, error: tuitionTxnInUsdError } = await supabase
                .from('tuition_in_txn_usd')
                .select('*')
                .eq('Date', today);
            if (tuitionTxnInUsdError) throw tuitionTxnInUsdError;
            setTuitionTxnInUsd(tuitionTxnInUsdData || []);

            // Fetch Tuition Transactions In ZWG
            const { data: tuitionTxnInZwgData, error: tuitionTxnInZwgError } = await supabase
                .from('tuition_in_txn_zwg')
                .select('*')
                .eq('Date', today);
            if (tuitionTxnInZwgError) throw tuitionTxnInZwgError;
            setTuitionTxnInZwg(tuitionTxnInZwgData || []);

            //Fetch Tuition Transactions Out USD
            const { data: tuitionTxnOutUsdData, error: tuitionTxnOutUsdError } = await supabase
                .from('tuition_out_txn_usd')
                .select('*')
                .eq('Date', today);
            if (tuitionTxnOutUsdError) throw tuitionTxnOutUsdError;
            setTuitionTxnOutUsd(tuitionTxnOutUsdData || []);

            // Fetch Tuition Transactions Out ZWG
            const { data: tuitionTxnOutZwgData, error: tuitionTxnOutZwgError } = await supabase
                .from('tuition_out_txn_zwg')
                .select('*')
                .eq('Date', today);
            if (tuitionTxnOutZwgError) throw tuitionTxnOutZwgError;
            setTuitionTxnOutZwg(tuitionTxnOutZwgData || []);

            // Calculate totals
            setCommissionIn(commissionIn.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setCommissionOut(commissionOut.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setLevyTxnInUsd(levyTxnInUsd.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setLevyTxnInZwg(levyTxnInZwg.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setLevyTxnOutUsd(levyTxnOutUsd.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setLevyTxnOutZwg(levyTxnOutZwg.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setTuitionTxnInUsd(tuitionTxnInUsd.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setTuitionTxnInZwg(tuitionTxnInZwg.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setTuitionTxnOutUsd(tuitionTxnOutUsd.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setTuitionTxnOutZwg(tuitionTxnOutZwg.reduce((sum, txn) => sum + (txn.Amount || 0), 0));

            setLevyTotal(levyUsdData.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            setTuitionTotal(tuitionUsdData.reduce((sum, txn) => sum + (txn.Amount || 0), 0));
            

            setLoading(false);
        } catch (error) {
            console.error('Error fetching daily transactions:', error);
            setLoading(false);
        }
    };

    const handleBank = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Post total levy USD to levy_txn_in_usd
            const { error: levyError } = await supabase.from('levy_in_txn_usd').insert([
                {
                    Date: today,
                    Amount: LevyTotal,
                    Description: 'Fees Deposit',
                    From: 'Fees',
                },
            ]);
            if (levyError) throw levyError;

            // Post total tuition USD to tuition_txn_in_usd
            const { error: tuitionError } = await supabase.from('tuition_in_txn_usd').insert([
                {
                    Date: today,
                    Amount: TuitionTotal,
                    Description: 'Deposit',
                    From: 'Fees',
                },
            ]);
            if (tuitionError) throw tuitionError;

            // Show alert with total amounts banked
            alert(
                `Banking Successful!\n\nTotal Levy USD Banked: $${LevyTotal.toFixed(
                    2
                )}\nTotal Tuition USD Banked: $${TuitionTotal.toFixed(2)}`
            );
        } catch (error) {
            console.error('Error banking transactions:', error);
            alert('Failed to bank transactions. Please try again.');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Daily Transactions Report</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg shadow-md border ">
                    <h3 className="text-lg font-bold text-blue-700">Commission In</h3>
                    <p className="text-xl font-semibold">${commissionIn.toFixed(2)}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg shadow-md border ">
                    <h3 className="text-lg font-bold text-red-700">Commission Out</h3>
                    <p className="text-xl font-semibold">${commissionOut.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg shadow-md border ">
                    <h3 className="text-lg font-bold text-green-700">Levy Txn In</h3>
                    <p className="text-sm">USD: ${levyTxnInUsd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${levyTxnInZwg.toFixed(2)}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md border">
                    <h3 className="text-lg font-bold text-blue-700">Levy Txn Out</h3>
                    <p className="text-sm">USD: ${levyTxnOutUsd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${levyTxnOutZwg.toFixed(2)}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg shadow-md border ">
                    <h3 className="text-lg font-bold text-purple-700">Tuition Txn In</h3>
                    <p className="text-sm">USD: ${tuitionTxnInUsd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${tuitionTxnInZwg.toFixed(2)}</p>
                </div>
                <div className="bg-indigo-100 p-4 rounded-lg shadow-md border ">
                    <h3 className="text-lg font-bold text-indigo-700">Tuition Txn Out</h3>
                    <p className="text-sm">USD: ${tuitionTxnOutUsd.toFixed(2)}</p>
                    <p className="text-sm">ZWG: ${tuitionTxnOutZwg.toFixed(2)}</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Panel (USD Transactions) */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    {/* Levy USD */}
                    <div className="bg-blue-100 shadow-lg rounded-lg p-6 border border-blue-300">
                        <h3 className="text-xl font-bold mb-4">Levy USD Transactions</h3>
                        {levyUsdTransactions.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {levyUsdTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-4 py-2">{transaction.id}</td>
                                            <td className="px-4 py-2">{new Date(transaction.Date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">${transaction.Amount.toFixed(2)}</td>
                                            <td className="px-4 py-2">{transaction.reference}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No transactions found for today.</p>
                        )}
                    </div>

                    {/* Tuition USD */}
                    <div className="bg-blue-150 shadow-lg rounded-lg p-6 border border-blue-400">
                        <h3 className="text-xl font-bold mb-4">Tuition USD Transactions</h3>
                        {tuitionUsdTransactions.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tuitionUsdTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-4 py-2">{transaction.id}</td>
                                            <td className="px-4 py-2">{new Date(transaction.Date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">${transaction.Amount.toFixed(2)}</td>
                                            <td className="px-4 py-2">{transaction.reference}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No transactions found for today.</p>
                        )}
                    </div>
                </div>

                {/* Right Panel (ZWG Transactions) */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    {/* Levy ZWG */}
                    <div className="bg-blue-150 shadow-lg rounded-lg p-6 border border-blue-500">
                        <h3 className="text-xl font-bold mb-4">Levy ZWG Transactions</h3>
                        {levyZwgTransactions.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {levyZwgTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-4 py-2">{transaction.id}</td>
                                            <td className="px-4 py-2">{new Date(transaction.Date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">${transaction.Amount.toFixed(2)}</td>
                                            <td className="px-4 py-2">${transaction.USD_equivalent.toFixed(2)}</td>
                                            <td className="px-4 py-2">{transaction.reference}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No transactions found for today.</p>
                        )}
                    </div>

                    {/* Tuition ZWG */}
                    <div className="bg-blue-100 shadow-lg rounded-lg p-6 border border-blue-600">
                        <h3 className="text-xl font-bold mb-4">Tuition ZWG Transactions</h3>
                        {tuitionZwgTransactions.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tuitionZwgTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-4 py-2">{transaction.id}</td>
                                            <td className="px-4 py-2">{new Date(transaction.Date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">${transaction.Amount.toFixed(2)}</td>
                                            <td className="px-4 py-2">${transaction.USD_equivalent.toFixed(2)}</td>
                                            <td className="px-4 py-2">{transaction.reference}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No transactions found for today.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bank Button */}
            <button
                onClick={handleBank}
                className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
                Bank
            </button>
        </div>
    );
};

export default DailyReport;


