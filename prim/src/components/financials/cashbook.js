import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import supabase from '../../db/SupaBaseConfig';
import { useTheme } from '../../contexts/ThemeContext';
import Loader from '../ui/loader';
import TopBar from '../ui/topbar';

const fetchAccounts = async () => {
    const { data, error } = await supabase
        .from('Accounts')
        .select('id, Bank, Branch, AccNumber, Currency');
    if (error) throw error;
    return data || [];
};

const fetchLevyBankTransactions = async ({ queryKey }) => {
    const [_key, { year, month, accountId, currency }] = queryKey;
    const startDate = new Date(year, month - 1, 1).toISOString().slice(0, 10);
    const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

    // Incoming
    let incomingQuery = supabase
        .from('IncomingBankTransactions')
        .select('Date, id, Amount, Category, Account, Currency')
        .gte('Date', startDate)
        .lte('Date', endDate);

    if (accountId) incomingQuery = incomingQuery.eq('Account', accountId);
    if (currency) incomingQuery = incomingQuery.eq('Currency', currency);

    const { data: debitData, error: debitError } = await incomingQuery;
    if (debitError) throw debitError;

    // Outgoing
    let outgoingQuery = supabase
        .from('OutgoingBankTransactions')
        .select('Date, id, Amount, Category, Accoount, Currency')
        .gte('Date', startDate)
        .lte('Date', endDate);

    if (accountId) outgoingQuery = outgoingQuery.eq('Accoount', accountId);
    if (currency) outgoingQuery = outgoingQuery.eq('Currency', currency);

    const { data: creditData, error: creditError } = await outgoingQuery;
    if (creditError) throw creditError;

    // Extract distinct categories
    const allCategories = [
        ...new Set([
            ...(debitData || []).map((entry) => entry.Category),
            ...(creditData || []).map((entry) => entry.Category),
        ]),
    ];
    return { debitData: debitData || [], creditData: creditData || [], categories: allCategories };
};

const Cashbook = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const { currentTheme } = useTheme();

    const { data: accounts = [] } = useQuery({
        queryKey: ['accounts'],
        queryFn: fetchAccounts
    });

    const currencyOptions = [...new Set(accounts.map(acc => acc.Currency))];

    const { data, isLoading } = useQuery({
        queryKey: [
            'levyBank',
            {
                year: selectedYear,
                month: selectedMonth,
                accountId: selectedAccount,
                currency: selectedCurrency
            }
        ],
        queryFn: fetchLevyBankTransactions,
        keepPreviousData: true,
    });

    const debitData = data?.debitData || [];
    const creditData = data?.creditData || [];
    const categories = data?.categories || [];

    const calculateTotals = (data) => {
        const totals = { Amount: 0 };
        categories.forEach((category) => {
            totals[category] = 0;
        });
        data.forEach((entry) => {
            totals.Amount += entry.Amount || 0;
            if (entry.Category && totals[entry.Category] !== undefined) {
                totals[entry.Category] += entry.Amount || 0;
            }
        });
        return totals;
    };

    if (isLoading) return <Loader type="card" count={1} />;

    const debitTotals = calculateTotals(debitData);
    const creditTotals = calculateTotals(creditData);

    return (
        <div className="p-6 min-h-screen" style={{ background: currentTheme.background?.default }}>
            <TopBar title="Levy Bank Cashbook" />
            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <label className="mr-2 font-semibold">Month:</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="px-4 py-2 border rounded-lg"
                        style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mr-2 font-semibold">Year:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-4 py-2 border rounded-lg"
                        style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i} value={new Date().getFullYear() - i}>
                                {new Date().getFullYear() - i}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mr-2 font-semibold">Account:</label>
                    <select
                        value={selectedAccount}
                        onChange={e => setSelectedAccount(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}
                    >
                        <option value="">All Accounts</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {acc.Bank} - {acc.Branch} - {acc.AccNumber} ({acc.Currency})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mr-2 font-semibold">Currency:</label>
                    <select
                        value={selectedCurrency}
                        onChange={e => setSelectedCurrency(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}
                    >
                        <option value="">All</option>
                        {currencyOptions.map(cur => (
                            <option key={cur} value={cur}>{cur.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
                style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {/* Debit Side */}
                            <th colSpan={categories.length + 4} className="text-left px-4 py-2 bg-blue-300">
                                Debit
                            </th>
                            {/* Credit Side */}
                            <th colSpan={categories.length + 4} className="text-left px-4 py-2 bg-red-300">
                                Credit
                            </th>
                        </tr>
                        <tr>
                            {/* Debit Columns */}
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Account
                            </th>
                            {categories.map((category) => (
                                <th
                                    key={category}
                                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {category}
                                </th>
                            ))}
                            {/* Credit Columns */}
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Account
                            </th>
                            {categories.map((category) => (
                                <th
                                    key={category}
                                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {category}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Rows */}
                        {Array.from({ length: Math.max(debitData.length, creditData.length) }).map((_, index) => (
                            <tr key={index}>
                                {/* Debit Row */}
                                {debitData[index] ? (
                                    <>
                                        <td className="px-4 py-2">{new Date(debitData[index].Date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{debitData[index].id}</td>
                                        <td className="px-4 py-2">${debitData[index].Amount !== undefined ? debitData[index].Amount.toFixed(2) : '0.00'}</td>
                                        <td className="px-4 py-2">
                                            {accounts.find(acc => acc.id === debitData[index].Account)
                                                ? accounts.find(acc => acc.id === debitData[index].Account).AccNumber
                                                : debitData[index].Account || 'N/A'}
                                        </td>
                                        {categories.map((category) => (
                                            <td key={category} className="px-4 py-2">
                                                {debitData[index].Category === category
                                                    ? `$${debitData[index].Amount !== undefined ? debitData[index].Amount.toFixed(2) : '0.00'}`
                                                    : ''}
                                            </td>
                                        ))}
                                    </>
                                ) : (
                                    <td colSpan={categories.length + 4} className="px-4 py-2"></td>
                                )}
                                {/* Credit Row */}
                                {creditData[index] ? (
                                    <>
                                        <td className="px-4 py-2">{new Date(creditData[index].Date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{creditData[index].id}</td>
                                        <td className="px-4 py-2">${creditData[index].Amount !== undefined ? creditData[index].Amount.toFixed(2) : '0.00'}</td>
                                        <td className="px-4 py-2">
                                            {accounts.find(acc => acc.id === creditData[index].Accoount)
                                                ? accounts.find(acc => acc.id === creditData[index].Accoount).AccNumber
                                                : creditData[index].Accoount || 'N/A'}
                                        </td>
                                        {categories.map((category) => (
                                            <td key={category} className="px-4 py-2">
                                                {creditData[index].Category === category
                                                    ? `$${creditData[index].Amount !== undefined ? creditData[index].Amount.toFixed(2) : '0.00'}`
                                                    : ''}
                                            </td>
                                        ))}
                                    </>
                                ) : (
                                    <td colSpan={categories.length + 4} className="px-4 py-2"></td>
                                )}
                            </tr>
                        ))}
                        {/* Totals Row */}
                        <tr>
                            {/* Debit Totals */}
                            <td className="px-4 py-2 font-bold">Totals</td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2 font-bold">${debitTotals.Amount !== undefined ? debitTotals.Amount.toFixed(2) : '0.00'}</td>
                            <td className="px-4 py-2"></td>
                            {categories.map((category) => (
                                <td key={category} className="px-4 py-2 font-bold">
                                    ${debitTotals[category] !== undefined ? debitTotals[category].toFixed(2) : '0.00'}
                                </td>
                            ))}
                            {/* Credit Totals */}
                            <td className="px-4 py-2 font-bold">Totals</td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2 font-bold">${creditTotals.Amount !== undefined ? creditTotals.Amount.toFixed(2) : '0.00'}</td>
                            <td className="px-4 py-2"></td>
                            {categories.map((category) => (
                                <td key={category} className="px-4 py-2 font-bold">
                                    ${creditTotals[category] !== undefined ? creditTotals[category].toFixed(2) : '0.00'}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Cashbook;