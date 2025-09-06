import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import { fetchStudents } from '../../api/studentsInfoApi';
import DataTable from '../../ui/dataTable';
import Button from '../../ui/button';
import TopBar from '../../ui/topbar';
import Card from '../../ui/card';
import SkeletonLoader from '../../ui/loader';
import { useToast } from '../../../contexts/ToastContext';
import { useTheme } from '../../../contexts/ThemeContext';
import Modal from '../../ui/modal';
import Form from '../../ui/form';
import Loader from '../../ui/loader';
import supabase from '../../../db/SupaBaseConfig';
import FeesModal from './FeesModal'; 
import NewStudent from './NewStudent';

const ITEMS_PER_PAGE = 20;

const Students = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(10);
    const [showNewStudentModal, setShowNewStudentModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        firstNames: '',
        surname: '',
        gender: '',
        grade: '',
        class: '',
        contactInfo: '',
        address: '',
        dob: '',
        sponsor: '',
        status: 'active'
    });
    const [formLoading, setFormLoading] = useState(false);
    const [showFeesModal, setShowFeesModal] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    // Fetch user data
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: (error) => {
            if (error.message.includes('Not authenticated')) {
                addToast('You are not authenticated. Please login.', 'error');
                navigate('/login');
            } else {
                addToast('User fetch error.', 'error');
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 300000,
        cacheTime: 600000
    });

    // Fetch students data only if user is authenticated
    const { data: students = [], isLoading: studentsLoading } = useQuery({
        queryKey: ['Students', { gradeFilter, classFilter, genderFilter }],
        queryFn: () => fetchStudents({ gradeFilter, classFilter, genderFilter }),
        enabled: !!userData?.role,
        onError: (error) => {
            addToast('Failed to fetch students.', 'error');
        }
    });

    const mutation = useMutation({
        mutationFn: async (studentData) => {
            const { error } = await supabase.from('Students').insert([studentData]);
            if (error) throw error;
        },
        onSuccess: () => {
            addToast('Student added successfully!', 'success');
            setShowNewStudentModal(false);
        },
        onError: () => {
            addToast('Error adding student.', 'error'); 
        }
    });

    const loading = userLoading || studentsLoading;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <SkeletonLoader type="card" count={1} />
            </div>
        );
    }

    const handleView = (studentId) => navigate(`/student-view/${studentId}`);
    const handleFees = (studentId) => {
        setSelectedStudentId(studentId);
        setShowFeesModal(true);
    };

    const columns = [
        // { header: 'Student ID', accessor: 'id' },
        {
            header: 'Full Name',
            render: (row) => `${row.firstNames} ${row.surname}`
        },

        
        { header: 'Gender', accessor: 'gender' },
        { header: 'Grade', accessor: 'grade' },
        { header: 'Class', accessor: 'class' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleView(row.id)}
                        variant="primary"
                        className="px-3 py-2"
                        title="View Student"
                    >
                        <span role="img" aria-label="View">➡️</span>
                    </Button>
                    <Button
                        onClick={() => handleFees(row.id)}
                        variant="success"
                        className="px-3 py-2"
                        title="Add Fee Payment"
                    >
                        <span role="img" aria-label="Add Fee">$</span>
                    </Button>
                </div>
            )
        }
    ];

    const filteredStudents = students.filter((student) =>
        `${student.firstNames} ${student.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (gradeFilter ? student.grade === gradeFilter : true) &&
        (classFilter ? student.class === classFilter : true) &&
        (genderFilter ? student.gender === genderFilter : true)
    );

    // PAGINATION: slice the filteredStudents for current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    const FilterDropdown = ({ value, onChange, options, label }) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg p-2 focus:outline-none focus:ring-2"
            style={{
                background: currentTheme.background?.paper,
                color: currentTheme.text?.primary,
                border: `1px solid ${currentTheme.divider || '#d1d5db'}`
            }}
        >
            <option value="">{`All ${label}`}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );

    const handleInputChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleAddStudent = (studentPayload) => {
        mutation.mutate(studentPayload);
    };

    return (
        <div className="p-6 bg-background min-h-screen relative">
            <TopBar title="Students" userName={userData?.name} />
            <div className="container  mx-auto p-6">
                <Card title="Students Details" className="h-fit"
                    headerAction={
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Search by Name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-lg p-2 focus:outline-none focus:ring-2"
                                style={{
                                    background: currentTheme.background?.paper,
                                    color: currentTheme.text?.primary,
                                    border: `1px solid ${currentTheme.divider || '#d1d5db'}`
                                }}
                            />
                            {userData?.role === 'bursar' && (
                                <Button
                                    onClick={() => setShowNewStudentModal(true)}
                                    variant="primary"
                                    className="px-4 py-2"
                                >
                                    Add Student
                                </Button>
                            )}
                        </div>
                    }
                >
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div className="flex space-x-10 px-25">
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
                                { value: 'male', label: 'male' },
                                { value: 'female', label: 'female' },
                            ]}
                            label="Genders"
                        />
                    </div>
                    
                </div>

                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={paginatedStudents} // <-- use paginatedStudents here
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        isLoading={userLoading || studentsLoading}
                        style={{ color: currentTheme.text?.primary }}
                    />
                </div>
                </Card>
                <NewStudent
                    open={showNewStudentModal}
                    onClose={() => setShowNewStudentModal(false)}
                    onSubmit={handleAddStudent}
                    loading={mutation.isLoading}
                    currentTheme={currentTheme}
                />
                <FeesModal
                    open={showFeesModal}
                    onClose={() => setShowFeesModal(false)}
                    studentId={selectedStudentId}
                    onSubmit={() => {
                        addToast('Fee payment added!', 'success');
                        setShowFeesModal(false);
                    }}
                />
            </div>
        </div>
    );
};

export default Students;