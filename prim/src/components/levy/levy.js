import React, { useState, useEffect } from 'react';
import supabase from '../../SupaBaseConfig';

const Levy = () => {
    const [usdLevies, setUsdLevies] = useState([]);
    const [zwgLevies, setZwgLevies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLevies();
    }, []);

    const fetchLevies = async () => {
        setLoading(true);
        try {
            const { data: usdData, error: usdError } = await supabase
                .from('levy_usd')
                .select('*, students(FirstNames, Surname, Grade, Class, Gender)')
                .order('Date', { ascending: false });

            if (usdError) throw usdError;
            setUsdLevies(usdData);

            const { data: zwgData, error: zwgError } = await supabase
                .from('levy_zwg')
                .select('*, students(FirstNames, Surname, Grade, Class, Gender)')
                .order('Date', { ascending: false });

            if (zwgError) throw zwgError;
            setZwgLevies(zwgData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching Levies:', error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Levy Payments</h2>

            {/* USD Levy Table */}
            <h3 className="text-lg font-semibold mb-2">USD Payments</h3>
            <table className="min-w-full divide-y divide-gray-200 mb-4">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {usdLevies.map((Levy) => (
                        <tr key={Levy.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.students.FirstNames} {Levy.students.Surname}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.students.Grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.students.Class}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.students.Gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(Levy.Date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.Amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Add action buttons here (e.g., update, delete) */}
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Update</button>
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ZiG Levy Table */}
            <h3 className="text-lg font-semibold mb-2">ZiG Payments</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {zwgLevies.map((Levy) => (
                        <tr key={Levy.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.students.FirstNames} {Levy.students.Surname}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.students.Grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.students.Class}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.students.Gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(Levy.Date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.Amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Levy.USD_equivalent}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Add action buttons here (e.g., update, delete) */}
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Update</button>
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Levy;