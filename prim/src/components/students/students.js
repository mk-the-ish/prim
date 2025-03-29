import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../../SupaBaseConfig';
import { useNavigate } from 'react-router-dom';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('Students').select('*');

        if (gradeFilter) query = query.eq('Grade', gradeFilter);
        if (classFilter) query = query.eq('Class', classFilter);
        if (genderFilter) query = query.eq('Gender', genderFilter);

        const { data, error } = await query.order('Grade', { ascending: true });

        if (error) {
            console.error('Error fetching students:', error);
        } else {
            setStudents(data);
        }
        setLoading(false);
    }, [gradeFilter, classFilter, genderFilter]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Filter students based on search term
    const filteredStudents = students.filter((student) =>
        `${student.FirstNames} ${student.Surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (studentId) => {
        navigate(`/student-view/${studentId}`);
    };

    const handleAddStudent = () => {
        navigate('/new-student'); // Navigate to the NewStudent component
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Student Records</h2>

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
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                    </select>
                    <select
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Classes</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
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
                        {filteredStudents.map((student) => (
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
            </div>
        </div>
    );
};

export default Students;