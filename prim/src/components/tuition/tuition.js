import React, { useState, useEffect } from 'react';
import supabase from '../../SupaBaseConfig';

const Tuition = () => {
    const [usdTuitions, setUsdTuitions] = useState([]);
    const [zwgTuitions, setZwgTuitions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTuitions();
    }, []);

    const fetchTuitions = async () => {
        setLoading(true);
        try {
            const { data: usdData, error: usdError } = await supabase
                .from('tuition_usd')
                .select('*, students(FirstNames, Surname, Grade, Class, Gender)')
                .order('Date', { ascending: false });

            if (usdError) throw usdError;
            setUsdTuitions(usdData);

            const { data: zwgData, error: zwgError } = await supabase
                .from('tuition_zwg')
                .select('*, students(FirstNames, Surname, Grade, Class, Gender)')
                .order('Date', { ascending: false });

            if (zwgError) throw zwgError;
            setZwgTuitions(zwgData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching tuitions:', error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Tuition Payments</h2>

            {/* USD Tuitions Table */}
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
                    {usdTuitions.map((tuition) => (
                        <tr key={tuition.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.students.FirstNames} {tuition.students.Surname}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.students.Grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.students.Class}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.students.Gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(tuition.Date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.Amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Add action buttons here (e.g., update, delete) */}
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Update</button>
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ZiG Tuitions Table */}
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
                    {zwgTuitions.map((tuition) => (
                        <tr key={tuition.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.students.FirstNames} {tuition.students.Surname}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.students.Grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.students.Class}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.students.Gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(tuition.Date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.Amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.USD_equivalent}</td>
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

export default Tuition;