import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';

const TIVusd = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tuition_in_txn_usd')
                .select('*')
                .order('Date', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">USD Tuition Revenue</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Created At</th>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-left">Description</th>
                                <th className="py-3 px-6 text-left">From</th>
                                <th className="py-3 px-6 text-left">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {transactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="border-b border-gray-200 hover:bg-gray-100"
                                >
                                    <td className="py-3 px-6 text-left">{transaction.id}</td>
                                    <td className="py-3 px-6 text-left">
                                        {new Date(transaction.created_at).toLocaleString()}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        {new Date(transaction.Date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-6 text-left">{transaction.Description}</td>
                                    <td className="py-3 px-6 text-left">{transaction.From}</td>
                                    <td className="py-3 px-6 text-left">${transaction.Amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TIVusd;