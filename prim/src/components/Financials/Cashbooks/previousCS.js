import React, { useState, useEffect } from "react";
import supabase from "../../../SupaBaseConfig";

const PreviousCS = () => {
    const [currency, setCurrency] = useState("USD"); // Default currency
    const [month, setMonth] = useState(""); // Selected month
    const [year, setYear] = useState(""); // Selected year
    const [account, setAccount] = useState("Levy"); // Default account type
    const [cashbooks, setCashbooks] = useState([]); // Fetched cashbooks
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        if (currency && month && year && account) {
            fetchCashbooks();
        }
    }, [currency, month, year, account]);

    const fetchCashbooks = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("Financials")
                .select("*")
                .eq("type", "cashbook")
                .eq("currency", currency)
                .eq("account", account)
                .eq("month", month)
                .eq("year", year);

            if (error) throw error;

            setCashbooks(data || []);
        } catch (error) {
            console.error("Error fetching cashbooks:", error);
        } finally {
            setLoading(false);
        }
    };

    const months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ];

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i); // Last 10 years

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">View Previous Cashbooks</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                {/* Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Currency Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                        >
                            <option value="usd">USD</option>
                            <option value="zwg">ZWG</option>
                        </select>
                    </div>

                    {/* Month Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                        >
                            <option value="">Select Month</option>
                            {months.map((month, index) => (
                                <option key={index} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Account Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                        <select
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                        >
                            <option value="cbz">CBZ</option>
                            <option value="zb">ZB</option>
                        </select>
                    </div>

                    {/* Year Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                        >
                            <option value="">Select Year</option>
                            {years.map((year, index) => (
                                <option key={index} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Cashbooks Table */}
                {loading ? (
                    <p>Loading...</p>
                ) : cashbooks.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    File
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cashbooks.map((cashbook) => (
                                <tr key={cashbook.id}>
                                    <td className="px-4 py-2">{cashbook.type}</td>
                                    <td className="px-4 py-2">
                                        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                                            {JSON.stringify(cashbook.File, null, 2)}
                                        </pre>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No cashbooks found for the selected criteria.</p>
                )}
            </div>
        </div>
    );
};

export default PreviousCS;