import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'; 
import { collection, getDocs, query, orderBy, doc } from 'firebase/firestore';

const Levy = () => {
    const [levyTransactions, setLevyTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLevyTransactions();
    }, []);

    const fetchLevyTransactions = async () => {
        setLoading(true);
        try {
            const levyCollectionRef = collection(
                db,
                'levy'
            );
            const q = query(levyCollectionRef, orderBy('date', 'desc')); // Ordered by date descending
            const querySnapshot = await getDocs(q);
            const transactions = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(), 
            }));
            setLevyTransactions(transactions);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching levy transactions:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Recent Levy Transactions</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount (USD)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Method
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {levyTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {transaction.studentID}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {transaction.amount_USD}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {transaction.date.toLocaleDateString()} {transaction.date.toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {transaction['payment method']}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Levy;