import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchPettyCashTransactions, fetchCBZPettyCashTransactions } from '../../api/pettyCashApi';

const ViewPC = () => {
    const navigate = useNavigate();
    const { data: creditTransactions = [] } = useQuery({
        queryKey: ['pettyCashTransactions'],
        queryFn: fetchPettyCashTransactions
    });
    const { data: debitTransactions = [] } = useQuery({
        queryKey: ['cbzPettyCashTransactions'],
        queryFn: fetchCBZPettyCashTransactions
    });

    const totalDebit = debitTransactions.reduce((sum, tx) => sum + Number(tx.Amount), 0);
    const totalCredit = creditTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const balance = totalDebit - totalCredit;

    return (
        <div className="p-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Petty Cash Balance</h2>
                <p className="text-xl font-semibold">${balance.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Debit Side */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Debit (Money In)</h3>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Description</th>
                                <th className="border p-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {debitTransactions.map((tx, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{tx.Date}</td>
                                    <td className="border p-2">{tx.Description}</td>
                                    <td className="border p-2">${tx.Amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button 
                        onClick={() => navigate('/transactions/levyOut')}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Withdraw From CBZ
                    </button>
                </div>

                {/* Credit Side */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Credit (Money Out)</h3>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Recipient</th>
                                <th className="border p-2">Description</th>
                                <th className="border p-2">Category</th>
                                <th className="border p-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditTransactions.map((tx, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{tx.date}</td>
                                    <td className="border p-2">{tx.Receipient}</td>
                                    <td className="border p-2">{tx.Description}</td>
                                    <td className="border p-2">{tx.Category}</td>
                                    <td className="border p-2">${tx.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button 
                        onClick={() => navigate('/transactions/petty-cash')}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Add New Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewPC;
