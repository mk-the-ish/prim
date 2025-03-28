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

    const handleSearch = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Students')
            .select('*')
            .or(`FirstNames.ilike.%${searchTerm}%,Surname.ilike.%${searchTerm}%`)
            .order('Grade', { ascending: true });

        if (error) {
            console.error('Error searching students:', error);
        } else {
            setStudents(data);
        }
        setLoading(false);
    };

    const handleView = (studentId) => {
        navigate(`/student-view/${studentId}`);
    };

    const handleAddStudent = () => {
        navigate('/new-student'); // Navigate to the NewStudent component
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded p-2 mr-2"
                />
                <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Search
                </button>
                <button onClick={handleAddStudent} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Student
                </button>
            </div>

            <div className="flex space-x-4 mb-4">
                <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="border p-2">
                    <option value="">All Grades</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    {/* Add more grades as needed */}
                </select>
                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="border p-2">
                    <option value="">All Classes</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    {/* Add more classes as needed */}
                </select>
                <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="border p-2">
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.FirstNames} {student.Surname}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.Gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.Grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.Class}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button onClick={() => handleView(student.id)} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Students;