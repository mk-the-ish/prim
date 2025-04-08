import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';

const TuitionZWG = () => {
    const [zwgTuition, setZwgTuition] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTuitionZWG();
    }, []);

    const fetchTuitionZWG = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tuition_zwg')
                .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
                .order('Date', { ascending: false });

            if (error) throw error;
            setZwgTuition(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ZWG Tuition:', error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md'>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {zwgTuition.map((tuition) => (
                        <tr key={tuition.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {tuition.Students ? `${tuition.Students.FirstNames} ${tuition.Students.Surname}` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.Students?.Grade || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.Students?.Class || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.Students?.Gender || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(tuition.Date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.Amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.USD_equivalent}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tuition.form}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TuitionZWG;