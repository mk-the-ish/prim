import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser, fetchCommissionsIn } from '../../api';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10

const CommIN = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    
    const navigate = useNavigate();

    const { data: userData, isLoading: userLoading } = useQuery({
            queryKey: ['user'],
            queryFn: fetchUser,
            onError: () => navigate('/login'),
            onSuccess: (data) => {
                if (!data || !['admin', 'bursar'].includes(data.role)) {
                    navigate('/unauthorised');
                    return null;
                }
            },
            refetchOnWindowFocus: false,
            staleTime: 0
        });


    const { data: commissions = [], isLoading: commissionsLoading } = useQuery({
        queryKey: ['commissionsIN'],
        queryFn: fetchCommissionsIn, 
        enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role)
    });
    
    
        const loading = userLoading || commissionsLoading;
    
        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading Commissions data...</p>
                    </div>
                </div>
            );
        }
    const filteredCommissions = Array.isArray(commissions)
        ? commissions.filter((commission) =>
            commission.From?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];
    
        const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
        const currentStudents = filteredCommissions.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(filteredCommissions.length / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">

            {/* Search Bar and Add New Button */}
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search From..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
                />
                <button
                    onClick={() => navigate('/newCommIn')}
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
                                    From
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
                                    <td className="px-6 py-4 whitespace-nowrap">{commission.From}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{commission.Amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{commission.Description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCommissions.length)} of {filteredCommissions.length} entries
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded ${currentPage === 1
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                    }`}
                            >
                                First
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded ${currentPage === 1
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                    }`}
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 bg-white border rounded">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded ${currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                    }`}
                            >
                                Next
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded ${currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                    }`}
                            >
                                Last
                            </button>
                        </div>
                    </div>
                </div>
            )};
        </div>
    )
};

export default CommIN;