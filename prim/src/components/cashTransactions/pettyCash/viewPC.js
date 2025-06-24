import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchPettyCashTransactions, fetchCBZPettyCashTransactions } from '../../api/pettyCashApi';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../ui/button';
import Card from '../../ui/card';

const ViewPC = () => {
    const navigate = useNavigate();
    const { currentTheme } = useTheme();

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
        <div className="p-6" style={{ background: currentTheme.background?.default, minHeight: '100vh' }}>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: currentTheme.primary?.main }}>Petty Cash Balance</h2>
                <p className="text-xl font-semibold" style={{ color: currentTheme.text?.primary }}>${balance.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Debit Side */}
                <Card title="Debit (Money In)" variant="secondary">
                    <div className="overflow-x-auto">
                        <table className="min-w-full" style={{ background: currentTheme.background?.paper }}>
                            <thead>
                                <tr>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Date</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Description</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {debitTransactions.map((tx, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{tx.Date}</td>
                                        <td className="border p-2">{tx.Description}</td>
                                        <td className="border p-2">${Number(tx.Amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button
                        onClick={() => navigate('/transactions/levyOut')}
                        variant="primary"
                        className="mt-4"
                    >
                        Withdraw From CBZ
                    </Button>
                </Card>

                {/* Credit Side */}
                <Card title="Credit (Money Out)" variant="secondary">
                    <div className="overflow-x-auto">
                        <table className="min-w-full" style={{ background: currentTheme.background?.paper }}>
                            <thead>
                                <tr>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Date</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Recipient</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Description</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Category</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creditTransactions.map((tx, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{tx.date}</td>
                                        <td className="border p-2">{tx.Receipient}</td>
                                        <td className="border p-2">{tx.Description}</td>
                                        <td className="border p-2">{tx.Category}</td>
                                        <td className="border p-2">${Number(tx.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button
                        onClick={() => navigate('/transactions/petty-cash')}
                        variant="success"
                        className="mt-4"
                    >
                        Add New Transaction
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default ViewPC;
