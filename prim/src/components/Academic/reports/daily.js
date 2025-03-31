import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';

const DailyReport = () => {
    const [levyUsdTransactions, setLevyUsdTransactions] = useState([]);
    const [levyZwgTransactions, setLevyZwgTransactions] = useState([]);
    const [tuitionUsdTransactions, setTuitionUsdTransactions] = useState([]);
    const [tuitionZwgTransactions, setTuitionZwgTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyTransactions();
    }, []);

    const fetchDailyTransactions = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            const { data: levyUsdData, error: levyUsdError } = await supabase
                .from('levy_usd')
                .select('*')
                .eq('Date', today);
            if (levyUsdError) throw levyUsdError;
            setLevyUsdTransactions(levyUsdData || []);

            const { data: levyZwgData, error: levyZwgError } = await supabase
                .from('levy_zwg')
                .select('*')
                .eq('Date', today);
            if (levyZwgError) throw levyZwgError;
            setLevyZwgTransactions(levyZwgData || []);

            const { data: tuitionUsdData, error: tuitionUsdError } = await supabase
                .from('tuition_usd')
                .select('*')
                .eq('Date', today);
            if (tuitionUsdError) throw tuitionUsdError;
            setTuitionUsdTransactions(tuitionUsdData || []);

            const { data: tuitionZwgData, error: tuitionZwgError } = await supabase
                .from('tuition_zwg')
                .select('*')
                .eq('Date', today);
            if (tuitionZwgError) throw tuitionZwgError;
            setTuitionZwgTransactions(tuitionZwgData || []);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching daily transactions:', error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Daily Transactions Report</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel (USD Transactions) */}
                <div className="flex flex-col gap-6">
                    {/* Levy USD */}
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-bold mb-4">Levy USD Transactions</h3>
                        {levyUsdTransactions.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {levyUsdTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-2 py-2">{transaction.id}</td>
                                            <td className="px-4 py-2">{new Date(transaction.Date).toLocaleDateString()}</td>
                                            <td className="px-3 py-2">${transaction.Amount.toFixed(2)}</td>
                                            <td className="px-3 py-2">{transaction.transaction_type}</td>
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
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-bold mb-4">Tuition USD Transactions</h3>
                        {tuitionUsdTransactions.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tuitionUsdTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-2 py-2">{transaction.id}</td>
                                            <td className="px-4 py-2">{new Date(transaction.Date).toLocaleDateString()}</td>
                                            <td className="px-3 py-2">${transaction.Amount.toFixed(2)}</td>
                                            <td className="px-3 py-2">{transaction.transaction_type}</td>
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
                <div className="flex flex-col gap-6">
                    {/* Levy ZWG */}
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-bold mb-4">Levy ZWG Transactions</h3>
                        {levyZwgTransactions.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {levyZwgTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-2 py-2">{transaction.id}</td>
                                            <td className="px-4 py-2">{new Date(transaction.Date).toLocaleDateString()}</td>
                                            <td className="px-3 py-2">${transaction.Amount.toFixed(2)}</td>
                                            <td className="px-3 py-2">${transaction.USD_equivalent.toFixed(2)}</td>
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
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-bold mb-4">Tuition ZWG Transactions</h3>
                        {tuitionZwgTransactions.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tuitionZwgTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-2 py-2">{transaction.id}</td>
                                            <td className="px-4 py-2">{new Date(transaction.Date).toLocaleDateString()}</td>
                                            <td className="px-3 py-2">${transaction.Amount.toFixed(2)}</td>
                                            <td className="px-3 py-2">${transaction.USD_equivalent.toFixed(2)}</td>
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
        </div>
    );
};

export default DailyReport;