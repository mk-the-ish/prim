import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';

const LevyZWG = () => {
    const [zwgLevies, setZwgLevies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLevyZWG();
    }, []);

    const fetchLevyZWG = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('levy_zwg')
                .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
                .order('Date', { ascending: false });

            if (error) throw error;
            setZwgLevies(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ZWG Levies:', error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">ZWG Payments</h3>
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
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {zwgLevies.map((levy) => (
                        <tr key={levy.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {levy.Students ? `${levy.Students.FirstNames} ${levy.Students.Surname}` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{levy.Students?.Grade || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{levy.Students?.Class || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{levy.Students?.Gender || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(levy.Date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{levy.Amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{levy.USD_equivalent}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LevyZWG;