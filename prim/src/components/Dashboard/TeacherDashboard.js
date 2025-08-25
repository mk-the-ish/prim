import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { fetchUserId } from '../api/userApi';
import { fetchStudents } from '../api/studentsInfoApi';
import { fetchStudentGrades, fetchTeacherClassAndGrade } from '../api/academicApi';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../ui/summaryCard';
import { CurrencyDollarIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/solid';
import TopBar from '../ui/topbar';
import DataTable from '../ui/dataTable';
import Loader from '../ui/loader';
import FAB from '../ui/FAB';
import Modal from '../ui/modal';
import Card from '../ui/card';

const TeacherDashboard = () => {
    const { currentTheme } = useTheme();
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [teacherClass, setTeacherClass] = useState('');
    const [teacherGrade, setTeacherGrade] = useState('');
    const [error, setError] = useState(null);
    // Remove mark schedule and attendance modals, use navigation instead
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId = await fetchUserId();
                console.log('User ID:', userId);
                const classData = await fetchTeacherClassAndGrade(userId);
                console.log('ClassData:', classData);
                setTeacherClass(classData.class || '');
                setTeacherGrade(classData.grade || '');
                const studentsData = await fetchStudents({
                    gradeFilter: classData.grade,
                    classFilter: classData.class
                });
                console.log('StudentsData:', studentsData);
                setStudents(studentsData || []);
            } catch (err) {
                console.error('Error fetching class or students:', err);
                setError('Failed to fetch class or students.');
            } finally {
                setLoading(false);
            }
        };
        fetchClassData();
    }, []);

    // Summary: average grade (if numeric), students count
    const averageGrade = (() => {
        const numericGrades = grades
            .map(g => parseFloat(g.Grade))
            .filter(g => !isNaN(g));
        if (numericGrades.length === 0) return '-';
        return (numericGrades.reduce((a, b) => a + b, 0) / numericGrades.length).toFixed(2);
    })();

    // Students table columns
    const handleView = (studentId) => navigate(`/student-view/${studentId}`);
    const handleAddGrade = (studentId) => navigate(`/add-grade/${studentId}`);
    const studentColumns = [
        { header: 'Student ID', accessor: 'id' },
        { header: 'Name', render: row => `${row.FirstNames} ${row.Surname}` },
        { header: 'Gender', accessor: 'Gender' },
        { header: 'Grade', accessor: 'Grade' },
        { header: 'Class', accessor: 'Class' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row.id)}
                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleAddGrade(row.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Add Grade
                    </button>
                </div>
            )
        }
    ];

    // FAB actions
    const fabActions = [
        <button key="mark-schedule" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => navigate('/mark-schedule')}>
            <span role="img" aria-label="Mark Schedule">📝</span> Mark Schedule
        </button>,
        <button key="attendance" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => navigate('/attendance')}>
            <span role="img" aria-label="Attendance">📋</span> Attendance
        </button>,
        <button key="print-class" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => { setModalContent('print-class'); setModalOpen(true); }}>
            <span role="img" aria-label="Print">🖨️</span> Print Class List
        </button>
    ];

    return (
        <div className="min-h-screen relative flex flex-col" style={{ background: currentTheme.background.default, color: currentTheme.text.primary }}>
            <TopBar title="Teacher Dashboard" />
            <div className="p-4 flex-1 w-full max-w-7xl mx-auto">
                {loading ? (
                    <Loader type="card" count={2} />
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <SummaryCard
                                title="Class"
                                icon={<AcademicCapIcon className="text-blue-500" />}
                                bgColor="bg-blue-200"
                            >
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>{teacherClass}</p>
                            </SummaryCard>
                            <SummaryCard
                                title="Grade"
                                icon={<AcademicCapIcon className="text-green-500" />}
                                bgColor="bg-green-200"
                            >
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>{teacherGrade}</p>
                            </SummaryCard>
                            <SummaryCard
                                title="Students"
                                icon={<UserGroupIcon className="text-purple-500" />}
                                bgColor="bg-purple-200"
                            >
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>{students.length}</p>
                            </SummaryCard>
                            <SummaryCard
                                title="Average Grade"
                                icon={<CurrencyDollarIcon className="text-yellow-500" />}
                                bgColor="bg-yellow-200"
                            >
                                <p className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>{averageGrade}</p>
                            </SummaryCard>
                        </div>
                        {/* Students Table */}
                        <Card title="My Students">
                            <DataTable
                                columns={studentColumns}
                                data={students}
                                currentPage={1}
                                totalPages={1}
                                itemsPerPage={students.length}
                                onPageChange={() => {}}
                            />
                        </Card>
                    </>
                )}
                {/* FAB for teacher actions */}
                <FAB actions={fabActions} />
                {/* Modal for FAB actions */}
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    {modalContent === 'print-class' && (
                        <div>
                            <h2 className="text-lg font-bold mb-4">Print Class List</h2>
                            <p className="text-gray-500">Use your browser's print function to print this page.</p>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default TeacherDashboard;
