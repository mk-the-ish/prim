import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import { fetchTuitionZWG } from '../../api/viewPaymentsApi';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const TuitionZWG = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const { data: userData, isLoading: userLoading } = useQuery({
            queryKey: ['user'],
            queryFn: fetchUser,
            onError: () => navigate('/login')
        });
    
        const { data: zwgTuition = [], isLoading: TuitionLoading } = useQuery({
            queryKey: ['levyZWG'],
            queryFn: fetchTuitionZWG,
            enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role)
        });
    
    const loading = userLoading || TuitionLoading;
    
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = zwgTuition.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(zwgTuition.length / ITEMS_PER_PAGE);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className='container mx-auto bg-white rounded-lg shadow-md overflow-hidden'>
            <div className="overflow-x-auto">
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
            {/* Pagination Controls */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, zwgTuition.length)} of {zwgTuition.length} entries
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
    );
};

export default TuitionZWG;