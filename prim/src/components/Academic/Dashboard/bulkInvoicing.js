import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';

const BulkInvoicing = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gradeFilter, setGradeFilter] = useState(''); // Filter by grade
    const [classFilter, setClassFilter] = useState(''); // Filter by class
    const [page, setPage] = useState(1); // Pagination
    const [totalPages, setTotalPages] = useState(1); // Total pages

    const PAGE_SIZE = 50; // Number of students per page

    useEffect(() => {
        fetchStudents();
    }, [gradeFilter, classFilter, page]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('Students')
                .select('id, FirstNames, Surname, Grade, Class, Levy_Owing, Tuition_Owing', { count: 'exact' })
                .order('id', { ascending: true })
                .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

            // Apply filters
            if (gradeFilter) query = query.eq('Grade', gradeFilter);
            if (classFilter) query = query.eq('Class', classFilter);

            const { data: studentsData, error, count } = await query;

            if (error) throw error;

            setStudents(studentsData);
            setTotalPages(Math.ceil(count / PAGE_SIZE)); // Calculate total pages
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students:', error);
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Bulk Invoicing</h1>

            {/* Filters */}
            <div className="mb-6 flex space-x-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Filter by Grade</label>
                    <input
                        type="text"
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        placeholder="Enter Grade"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Filter by Class</label>
                    <input
                        type="text"
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        placeholder="Enter Class"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Print Button */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-6"
                >
                    Print Displayed Invoices
                </button>

                {/* Student Invoices */}
                {loading ? (
                    <p>Loading...</p>
                ) : students.length === 0 ? (
                    <p>No students found.</p>
                ) : (
                    <div className="space-y-8">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
                            >
                                <h2 className="text-xl font-bold mb-4">Student Invoice</h2>
                                <p><strong>Student ID:</strong> {student.id}</p>
                                <p><strong>Full Name:</strong> {student.FirstNames} {student.Surname}</p>
                                <p><strong>Grade:</strong> {student.Grade}</p>
                                <p><strong>Class:</strong> {student.Class}</p>
                                <p><strong>Levy Owed:</strong> ${student.Levy_Owing?.toFixed(2) || '0.00'}</p>
                                <p><strong>Tuition Owed:</strong> ${student.Tuition_Owing?.toFixed(2) || '0.00'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center space-x-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
                >
                    Previous
                </button>
                <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg ${page === totalPages ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BulkInvoicing;