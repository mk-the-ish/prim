import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchUser, fetchStudents } from '../../api';

const Students = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(10);
    const navigate = useNavigate();

    // Fetch user data
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

    // Fetch students data
    const { data: students = [], isLoading: studentsLoading } = useQuery({
        queryKey: ['students', { gradeFilter, classFilter, genderFilter }],
        queryFn: () => fetchStudents({ gradeFilter, classFilter, genderFilter }),
        enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role),
        onError: (error) => {
            console.error('Failed to fetch students:', error);
            navigate('/unauthorised');
        }
    });

    const loading = userLoading || studentsLoading;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Student data...</p>
                </div>
            </div>
        );
    }

    if (!userData?.role || !['admin', 'bursar'].includes(userData.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Unauthorized Access</h2>
                    <p className="text-gray-600">You don't have permission to view this page.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    // Filter and pagination logic
    const filteredStudents = students.filter((student) =>
        `${student.FirstNames} ${student.Surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    const handleView = (studentId) => navigate(`/student-view/${studentId}`);
    const handleAddStudent = () => navigate('/new-student');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Student data...</p>
                </div>
            </div>
        );
    }

    const Pagination = ({currentPage, totalPages, setCurrentPage, indexOfFirstStudent, indexOfLastStudent, totalStudents}) => {
        return (
            <div className="flex justify-between items-center mt-4 pb-4">
                <div className="text-sm text-gray-600">
                    Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} entries
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
                    <div className="flex items-center px-3 py-1 bg-white border rounded">
                        Page {currentPage} of {totalPages}
                    </div>
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
        );
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                    <FaUserCircle className="text-lg" /> 
                    <span className="ml-4">{userData?.name || 'Profile'}</span>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">Students</h1>
            </div>
        <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">

            {/* Filter and Search Section */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="flex space-x-4">
                    <select
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Grades</option>
                        <option value="ECD A">ECD A</option>
                        <option value="ECD B">ECD B</option>
                        <option value="1">Grade 1</option>
                        <option value="2">Grade 2</option>
                        <option value="3">Grade 3</option>
                        <option value="4">Grade 4</option>
                        <option value="5">Grade 5</option>
                        <option value="6">Grade 6</option>
                        <option value="7">Grade 7</option>
                    </select>
                    <select
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Classes</option>
                        <option value="green">green</option>
                        <option value="red">red</option>
                        <option value="yellow">yellow</option>
                        <option value="orange">orange</option>
                        <option value="blue">blue</option>
                        <option value="pink">pink</option>
                        <option value="white">white</option>
                        <option value="purple">purple</option>
                        <option value="brown">brown</option>
                        <option value="maroon"></option>
                    </select>
                    <select
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Search by Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddStudent}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Add Student
                    </button>
                </div>
            </div>

            {/* Student Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Full Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gender
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Grade
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Class
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentStudents.map((student) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {student.FirstNames} {student.Surname}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{student.Gender}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{student.Grade}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{student.Class}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleView(student.id)}
                                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        indexOfFirstStudent={indexOfFirstStudent}
                        indexOfLastStudent={indexOfLastStudent}
                        totalStudents={filteredStudents.length}
                />
            </div>
        </div>
        </div>
    );
};

export default Students;