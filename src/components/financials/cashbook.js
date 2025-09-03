import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import supabase from '../../db/SupaBaseConfig';
import { useTheme } from '../../contexts/ThemeContext';
import Loader from '../ui/loader';
import TopBar from '../ui/topbar';

// Utility to get start/end dates for month or year
const getPeriod = (type, year, month) => {
    if (type === 'cashbook') {
        const startDate = new Date(year, month - 1, 1).toISOString().slice(0, 10);
        const endDate = new Date(year, month - 1 + 1, 0).toISOString().slice(0, 10); // last day of month
        return { startDate, endDate };
    } else {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        return { startDate, endDate };
    }
};

const fetchAccounts = async () => {
    const { data, error } = await supabase
        .from('Accounts')
        .select('id, Bank, Branch, AccNumber, Currency');
    if (error) throw error;
    return data || [];
};

const fetchTransactions = async ({ queryKey }) => {
    const [_key, { type, year, month, accountId, currency }] = queryKey;
    const { startDate, endDate } = getPeriod(type, year, month);

    // Incoming
    let incomingQuery = supabase
        .from('IncomingBankTransactions')
        .select('Date, id, Amount, Category, Account, Currency, Description, From')
        .gte('Date', startDate)
        .lte('Date', endDate);

    if (accountId) incomingQuery = incomingQuery.eq('Account', accountId);
    if (currency) incomingQuery = incomingQuery.eq('Currency', currency);

    const { data: incomingData, error: incomingError } = await incomingQuery;
    if (incomingError) throw incomingError;

    // Outgoing
    let outgoingQuery = supabase
        .from('OutgoingBankTransactions')
        .select('Date, id, Amount, Category, Account, Currency, Description, To')
        .gte('Date', startDate)
        .lte('Date', endDate);

    if (accountId) outgoingQuery = outgoingQuery.eq('Account', accountId);
    if (currency) outgoingQuery = outgoingQuery.eq('Currency', currency);

    const { data: outgoingData, error: outgoingError } = await outgoingQuery;
    if (outgoingError) throw outgoingError;

    // Extract distinct categories
    const allCategories = [
        ...new Set([
            ...(incomingData || []).map((entry) => entry.Category),
            ...(outgoingData || []).map((entry) => entry.Category),
        ]),
    ];
    return { incomingData: incomingData || [], outgoingData: outgoingData || [], categories: allCategories };
};

const Cashbook = () => {
    const [statementType, setStatementType] = useState('cashbook');
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
            'financials',
            {
                type: statementType,
                year: selectedYear,
                month: selectedMonth,
                accountId: selectedAccount,
                currency: selectedCurrency
            }
        ],
        queryFn: fetchTransactions,
        keepPreviousData: true,
    });

    const incomingData = data?.incomingData || [];
    const outgoingData = data?.outgoingData || [];
    const categories = data?.categories || [];

    // Cashbook monthly
    const renderCashbook = () => {
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

        const debitTotals = calculateTotals(incomingData);
        const creditTotals = calculateTotals(outgoingData);

        return (
            <div
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
                style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th colSpan={categories.length + 4} className="text-left px-4 py-2 bg-blue-300">
                                Debit
                            </th>
                            <th colSpan={categories.length + 4} className="text-left px-4 py-2 bg-red-300">
                                Credit
                            </th>
                        </tr>
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Transaction ID</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Account</th>
                            {categories.map((category) => (
                                <th key={category} className="px-4 py-2">{category}</th>
                            ))}
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Transaction ID</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Account</th>
                            {categories.map((category) => (
                                <th key={category} className="px-4 py-2">{category}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: Math.max(incomingData.length, outgoingData.length) }).map((_, index) => (
                            <tr key={index}>
                                {/* Debit Row */}
                                {incomingData[index] ? (
                                    <>
                                        <td className="px-4 py-2">{new Date(incomingData[index].Date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{incomingData[index].id}</td>
                                        <td className="px-4 py-2">${incomingData[index].Amount !== undefined ? incomingData[index].Amount.toFixed(2) : '0.00'}</td>
                                        <td className="px-4 py-2">
                                            {accounts.find(acc => acc.id === incomingData[index].Account)
                                                ? accounts.find(acc => acc.id === incomingData[index].Account).AccNumber
                                                : incomingData[index].Account || 'N/A'}
                                        </td>
                                        {categories.map((category) => (
                                            <td key={category} className="px-4 py-2">
                                                {incomingData[index].Category === category
                                                    ? `$${incomingData[index].Amount !== undefined ? incomingData[index].Amount.toFixed(2) : '0.00'}`
                                                    : ''}
                                            </td>
                                        ))}
                                    </>
                                ) : (
                                    <td colSpan={categories.length + 4} className="px-4 py-2"></td>
                                )}
                                {/* Credit Row */}
                                {outgoingData[index] ? (
                                    <>
                                        <td className="px-4 py-2">{new Date(outgoingData[index].Date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{outgoingData[index].id}</td>
                                        <td className="px-4 py-2">${outgoingData[index].Amount !== undefined ? outgoingData[index].Amount.toFixed(2) : '0.00'}</td>
                                        <td className="px-4 py-2">
                                            {accounts.find(acc => acc.id === outgoingData[index].Account)
                                                ? accounts.find(acc => acc.id === outgoingData[index].Account).AccNumber
                                                : outgoingData[index].Account || 'N/A'}
                                        </td>
                                        {categories.map((category) => (
                                            <td key={category} className="px-4 py-2">
                                                {outgoingData[index].Category === category
                                                    ? `$${outgoingData[index].Amount !== undefined ? outgoingData[index].Amount.toFixed(2) : '0.00'}`
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
                            <td className="px-4 py-2 font-bold">Totals</td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2 font-bold">${debitTotals.Amount !== undefined ? debitTotals.Amount.toFixed(2) : '0.00'}</td>
                            <td className="px-4 py-2"></td>
                            {categories.map((category) => (
                                <td key={category} className="px-4 py-2 font-bold">
                                    ${debitTotals[category] !== undefined ? debitTotals[category].toFixed(2) : '0.00'}
                                </td>
                            ))}
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
        );
    };

    // Trial Balance yearly
    const renderTrialBalance = () => {
        // Aggregate debits and credits by category
        const balanceMap = new Map();
        incomingData.forEach(transaction => {
            const { Category, Amount } = transaction;
            if (!balanceMap.has(Category)) {
                balanceMap.set(Category, { credits: 0, debits: 0 });
            }
            balanceMap.get(Category).credits += Amount;
        });
        outgoingData.forEach(transaction => {
            const { Category, Amount } = transaction;
            if (!balanceMap.has(Category)) {
                balanceMap.set(Category, { credits: 0, debits: 0 });
            }
            balanceMap.get(Category).debits += Amount;
        });
        const balanceArray = Array.from(balanceMap, ([category, balances]) => ({
            category,
            ...balances,
        }));
        const totalDebits = balanceArray.reduce((sum, item) => sum + item.debits, 0);
        const totalCredits = balanceArray.reduce((sum, item) => sum + item.credits, 0);

        return (
            <div className="min-h-screen bg-gray-100 p-4 font-sans">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <header className="bg-emerald-600 text-white p-6 text-center">
                        <h1 className="text-3xl font-bold">Trial Balance Report</h1>
                        <p className="mt-2 text-sm">A summary of debit and credit balances by category.</p>
                    </header>
                    <main className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border-collapse">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700 uppercase tracking-wider rounded-tl-xl">Category</th>
                                        <th className="py-3 px-4 text-right font-semibold text-gray-700 uppercase tracking-wider">Debits ($)</th>
                                        <th className="py-3 px-4 text-right font-semibold text-gray-700 uppercase tracking-wider rounded-tr-xl">Credits ($)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {balanceArray.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-gray-800 capitalize">{item.category}</td>
                                            <td className="py-3 px-4 text-right text-gray-600">{item.debits.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-right text-gray-600">{item.credits.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-100 font-bold">
                                    <tr className="border-t-2 border-gray-300">
                                        <td className="py-3 px-4 text-left text-gray-800 rounded-bl-xl">Total</td>
                                        <td className="py-3 px-4 text-right text-gray-800">{totalDebits.toFixed(2)}</td>
                                        <td className="py-3 px-4 text-right text-gray-800 rounded-br-xl">{totalCredits.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="mt-6 p-4 rounded-xl text-center shadow-inner
                            bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                            {totalDebits === totalCredits ? (
                                <p>✅ The trial balance is in agreement! Debits equal Credits.</p>
                            ) : (
                                <p>⚠️ The trial balance is out of balance. Debits do not equal Credits.</p>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        );
    };

    // Profit and Loss yearly
    const renderProfitLoss = () => {
        // Aggregate revenue and expenses by category
        const revenueMap = incomingData.reduce((acc, transaction) => {
            const { Category, Amount } = transaction;
            acc[Category] = (acc[Category] || 0) + Amount;
            return acc;
        }, {});
        const expensesMap = outgoingData.reduce((acc, transaction) => {
            const { Category, Amount } = transaction;
            acc[Category] = (acc[Category] || 0) + Amount;
            return acc;
        }, {});
        const totalRevenue = Object.values(revenueMap).reduce((sum, amount) => sum + amount, 0);
        const totalExpenses = Object.values(expensesMap).reduce((sum, amount) => sum + amount, 0);
        const netIncome = totalRevenue - totalExpenses;

        return (
            <div className="min-h-screen bg-gray-100 p-4 font-sans">
                <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <header className="bg-emerald-600 text-white p-6 text-center">
                        <h1 className="text-3xl font-bold">Profit and Loss Statement</h1>
                        <p className="mt-2 text-sm">A summary of your revenues and expenses.</p>
                    </header>
                    <main className="p-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-emerald-500 pb-2 mb-4">Revenue</h2>
                            <ul className="list-none p-0 space-y-2">
                                {Object.entries(revenueMap).map(([category, amount]) => (
                                    <li key={category} className="flex justify-between items-center bg-green-50 rounded-xl p-3">
                                        <span className="text-gray-700 capitalize">{category}</span>
                                        <span className="font-medium text-green-700">${amount.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-red-500 pb-2 mb-4">Expenses</h2>
                            <ul className="list-none p-0 space-y-2">
                                {Object.entries(expensesMap).map(([category, amount]) => (
                                    <li key={category} className="flex justify-between items-center bg-red-50 rounded-xl p-3">
                                        <span className="text-gray-700 capitalize">{category}</span>
                                        <span className="font-medium text-red-700">${amount.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={`p-6 rounded-xl text-center font-bold text-lg border-4
                            ${netIncome >= 0 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            <p className="text-sm mb-1">Net Income</p>
                            <p className="text-4xl">
                                ${netIncome.toFixed(2)}
                            </p>
                            <p className="text-xs italic mt-2">
                                {netIncome >= 0 ? 'Your business is profitable.' : 'Your business is currently operating at a loss.'}
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        );
    };

    if (isLoading) return <Loader type="card" count={1} />;

    // Period filter controls
    return (
        <div className="p-6 min-h-screen" style={{ background: currentTheme.background?.default }}>
            <TopBar title="Financial
            
            Statements" />
            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <label className="mr-2 font-semibold">Statement:</label>
                    <select
                        value={statementType}
                        onChange={e => setStatementType(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}
                    >
                        <option value="cashbook">Cashbook (Monthly)</option>
                        <option value="trial">Trial Balance (Yearly)</option>
                        <option value="pl">Profit & Loss (Yearly)</option>
                    </select>
                </div>
                <div>
                    <label className="mr-2 font-semibold">Year:</label>
                    <select
                        value={selectedYear}
                        onChange={e => setSelectedYear(parseInt(e.target.value))}
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
                {statementType === 'cashbook' && (
                    <div>
                        <label className="mr-2 font-semibold">Month:</label>
                        <select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(parseInt(e.target.value))}
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
                )}
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
            {statementType === 'cashbook' && renderCashbook()}
            {statementType === 'trial' && renderTrialBalance()}
            {statementType === 'pl' && renderProfitLoss()}
        </div>
    );
};

export default Cashbook;