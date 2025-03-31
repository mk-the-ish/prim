import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';
import { useNavigate } from 'react-router-dom';

const CommOUT = () => {
    const [commissions, setCommissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch commissions from the Supabase database
    const fetchCommissions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('commissions_out')
            .select('id, Date, To, Amount, Description')
            .order('Date', { ascending: false });

        if (error) {
            console.error('Error fetching commissions:', error);
        } else {
            setCommissions(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    // Filter commissions based on the search term
    const filteredCommissions = commissions.filter((commission) =>
        commission.To.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Commissions Out</h2>

            {/* Search Bar and Add New Button */}
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search To..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
                />
                <button
                    onClick={() => navigate('/newCommOut')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Add New
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    To
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCommissions.map((commission) => (
                                <tr key={commission.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{commission.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{commission.Date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{commission.To}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{commission.Amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{commission.Description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CommOUT;