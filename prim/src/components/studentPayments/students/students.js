import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import { fetchStudents } from '../../api/studentsInfoApi';
import DataTable from '../../../UIcomponents/dataTable';
import Button from '../../ui/button';
import TopBar from '../../ui/topbar';
import SkeletonLoader from '../../ui/loader';
import { useToast } from '../../../contexts/ToastContext';

const ITEMS_PER_PAGE = 10;

const Students = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(10);
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Fetch user data
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => fetchUser(['admin', 'bursar']),
        retry: (failureCount, error) => {
            return failureCount < 3 && !error.message.includes('Unauthorized');
        },
        onError: (error) => {
            if (error.message.includes('Not authenticated')) {
                addToast('You are not authenticated. Please login.', 'error');
                navigate('/login');
            } else if (error.message.includes('Unauthorized')) {
                addToast('You are not authorized to view this page.', 'error');
                navigate('/unauthorised');
            } else {
                addToast('User fetch error.', 'error');
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 300000,
        cacheTime: 600000
    });

    // Fetch students data only if user is authenticated and authorized
    const { data: students = [], isLoading: studentsLoading } = useQuery({
        queryKey: ['students', { gradeFilter, classFilter, genderFilter }],
        queryFn: () => fetchStudents({ gradeFilter, classFilter, genderFilter }),
        enabled: !!userData?.role,
        onError: (error) => {
            addToast('Failed to fetch students.', 'error');
            navigate('/unauthorised');
        }
    });

    const loading = userLoading || studentsLoading;

    useEffect(() => {
        if (
            !userLoading &&
            (!userData?.role || !['admin', 'bursar'].includes(userData.role))
        ) {
            addToast("You don't have permission to view this page.", 'error');
            navigate('/unauthorised');
        }
        // eslint-disable-next-line
    }, [userLoading, userData, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <SkeletonLoader type="card" count={1} />
            </div>
        );
    }

    const handleView = (studentId) => navigate(`/student-view/${studentId}`);

    const columns = [
        { header: 'Student ID', accessor: 'id' },
        {
            header: 'Full Name',
            render: (row) => `${row.FirstNames} ${row.Surname}`
        },
        { header: 'Gender', accessor: 'Gender' },
        { header: 'Grade', accessor: 'Grade' },
        { header: 'Class', accessor: 'Class' },
        {
            header: 'Actions',
            render: (row) => (
                <Button
                    onClick={() => handleView(row.id)}
                    variant="primary"
                    className="px-4 py-2"
                >
                    View
                </Button>
            )
        }
    ];

    const filteredStudents = students.filter((student) =>
        `${student.FirstNames} ${student.Surname}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (gradeFilter ? student.Grade === gradeFilter : true) &&
        (classFilter ? student.Class === classFilter : true) &&
        (genderFilter ? student.Gender === genderFilter : true)
    );

    const FilterDropdown = ({ value, onChange, options, label }) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">{`All ${label}`}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            <TopBar title="Students" userName={userData?.name} />

            <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div className="flex space-x-4">
                        <FilterDropdown
                            value={gradeFilter}
                            onChange={setGradeFilter}
                            options={[
                                { value: 'ECD A', label: 'ECD A' },
                                { value: 'ECD B', label: 'ECD B' },
                                { value: '1', label: 'Grade 1' },
                                { value: '2', label: 'Grade 2' },
                                { value: '3', label: 'Grade 3' },
                                { value: '4', label: 'Grade 4' },
                                { value: '5', label: 'Grade 5' },
                                { value: '6', label: 'Grade 6' },
                                { value: '7', label: 'Grade 7' },
                            ]}
                            label="Grades"
                        />
                        <FilterDropdown
                            value={classFilter}
                            onChange={setClassFilter}
                            options={[
                                { value: 'green', label: 'Green' },
                                { value: 'red', label: 'Red' },
                                { value: 'yellow', label: 'Yellow' },
                                { value: 'orange', label: 'Orange' },
                                { value: 'blue', label: 'Blue' },
                                { value: 'pink', label: 'Pink' },
                                { value: 'white', label: 'White' },
                                { value: 'purple', label: 'Purple' },
                                { value: 'brown', label: 'Brown' },
                                { value: 'maroon', label: 'Maroon' },
                            ]}
                            label="Classes"
                        />
                        <FilterDropdown
                            value={genderFilter}
                            onChange={setGenderFilter}
                            options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                            ]}
                            label="Genders"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Search by Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button
                            onClick={() => navigate('/new-student')}
                            variant="primary"
                            className="px-4 py-2"
                        >
                            Add Student
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredStudents}
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        isLoading={userLoading || studentsLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Students;