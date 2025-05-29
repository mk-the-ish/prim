import React, { useState, useEffect } from 'react';
import supabase from '../../../../db/SupaBaseConfig';

const CSLzwg = () => {
    const [debitData, setDebitData] = useState([]);
    const [creditData, setCreditData] = useState([]);
    const [debitCategories, setDebitCategories] = useState([]);
    const [creditCategories, setCreditCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    

    useEffect(() => {
        fetchCashbookData();
    }, [selectedMonth]);

    const fetchCashbookData = async () => {
        setLoading(true);
        try {
            const startDate = `${selectedMonth}-01`;
            const endDate = new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1], 0).toISOString().split('T')[0];

            // Fetch debit data (levy_in_txn_usd)
            const { data: debitData, error: debitError } = await supabase
                .from('levy_in_txn_zwg')
                .select('Date, id, Amount, Category')
                .gte('Date', startDate)
                .lte('Date', endDate);

            if (debitError) throw debitError;

            // Fetch credit data (levy_out_txn_usd)
            const { data: creditData, error: creditError } = await supabase
                .from('levy_out_txn_zwg')
                .select('Date, id, Amount, Category')
                .gte('Date', startDate)
                .lte('Date', endDate);

            if (creditError) throw creditError;

            // Extract distinct categories for debit and credit
            const debitCategories = [...new Set(debitData.map((entry) => entry.category))];
            const creditCategories = [...new Set(creditData.map((entry) => entry.category))];

            setDebitData(debitData);
            setCreditData(creditData);
            setDebitCategories(debitCategories);
            setCreditCategories(creditCategories);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cashbook data:', error);
            setLoading(false);
        }
    };

    const calculateTotals = (data, categories) => {
        const totals = { Amount: 0 };
        categories.forEach((category) => {
            totals[category] = 0;
        });

        data.forEach((entry) => {
            totals.Amount += entry.Amount || 0;
            if (entry.category && totals[entry.category] !== undefined) {
                totals[entry.category] += entry.Amount || 0;
            }
        });

        return totals;
    };

    if (loading) return <p>Loading...</p>;

    const debitTotals = calculateTotals(debitData, debitCategories);
    const creditTotals = calculateTotals(creditData, creditCategories);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-semibold mb-6 text-center">Levy ZWG Cashbook</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {/* Debit Side */}
                            <th colSpan={debitCategories.length + 3} className="text-left px-4 py-2 bg-blue-100">
                                Debit
                            </th>
                            {/* Credit Side */}
                            <th colSpan={creditCategories.length + 3} className="text-left px-4 py-2 bg-red-100">
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
                            {debitCategories.map((category) => (
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
                            {creditCategories.map((category) => (
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
                                        <td className="px-4 py-2">${debitData[index].Amount.toFixed(2)}</td>
                                        {debitCategories.map((category) => (
                                            <td key={category} className="px-4 py-2">
                                                {debitData[index].category === category
                                                    ? `$${debitData[index].Amount.toFixed(2)}`
                                                    : ''}
                                            </td>
                                        ))}
                                    </>
                                ) : (
                                    <td colSpan={debitCategories.length + 3} className="px-4 py-2"></td>
                                )}
                                {/* Credit Row */}
                                {creditData[index] ? (
                                    <>
                                        <td className="px-4 py-2">{new Date(creditData[index].Date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{creditData[index].id}</td>
                                        <td className="px-4 py-2">${creditData[index].Amount.toFixed(2)}</td>
                                        {creditCategories.map((category) => (
                                            <td key={category} className="px-4 py-2">
                                                {creditData[index].category === category
                                                    ? `$${creditData[index].Amount.toFixed(2)}`
                                                    : ''}
                                            </td>
                                        ))}
                                    </>
                                ) : (
                                    <td colSpan={creditCategories.length + 3} className="px-4 py-2"></td>
                                )}
                            </tr>
                        ))}
                        {/* Totals Row */}
                        <tr>
                            {/* Debit Totals */}
                            <td className="px-4 py-2 font-bold">Totals</td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2 font-bold">${debitTotals.Amount.toFixed(2)}</td>
                            {debitCategories.map((category) => (
                                <td key={category} className="px-4 py-2 font-bold">
                                    ${debitTotals[category].toFixed(2)}
                                </td>
                            ))}
                            {/* Credit Totals */}
                            <td className="px-4 py-2 font-bold">Totals</td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2 font-bold">${creditTotals.Amount.toFixed(2)}</td>
                            {creditCategories.map((category) => (
                                <td key={category} className="px-4 py-2 font-bold">
                                    ${creditTotals[category].toFixed(2)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='mt-6'>
                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-2 py-2 border rounded-lg"
                />
                <button
                    onClick={fetchCashbookData}
                    className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 mr-4"
                >
                    Refresh Data
                </button>
            </div>
        </div>
    );
};

export default CSLzwg;