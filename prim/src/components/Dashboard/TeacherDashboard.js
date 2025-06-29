import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { fetchUser } from '../api/userApi';
import { fetchStudents } from '../api/studentsInfoApi';
import { fetchStudentGrades } from '../api/academicApi';
import Card from '../ui/card';
import DataTable from '../ui/dataTable';
import Loader from '../ui/loader';
import FAB from '../ui/FAB';
import Modal from '../ui/modal';

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

    useEffect(() => {
        const fetchClassData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get teacher's class and grade from user profile
                const user = await fetchUser(['teacher']);
                setTeacherClass(user.class || '');
                setTeacherGrade(user.grade || '');
                // Fetch students in this class
                const studentsData = await fetchStudents({
                    gradeFilter: user.grade,
                    classFilter: user.class
                });
                setStudents(studentsData || []);
                // Fetch all grades for these students
                const allGrades = [];
                for (const student of studentsData) {
                    const studentGrades = await fetchStudentGrades(student.id);
                    allGrades.push(...(studentGrades || []));
                }
                setGrades(allGrades);
            } catch (err) {
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
    const studentColumns = [
        { header: 'Student ID', accessor: 'id' },
        { header: 'Name', render: row => `${row.FirstNames} ${row.Surname}` },
        { header: 'Gender', accessor: 'Gender' },
        { header: 'Grade', accessor: 'Grade' },
        { header: 'Class', accessor: 'Class' },
    ];

    // FAB actions
    const fabActions = [
        <button key="add-grade" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => { setModalContent('add-grade'); setModalOpen(true); }}>
            <span role="img" aria-label="Add Grade">➕</span> Add Grade
        </button>,
        <button key="print-class" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => { setModalContent('print-class'); setModalOpen(true); }}>
            <span role="img" aria-label="Print">🖨️</span> Print Class List
        </button>
    ];

    return (
        <div className="p-6 min-h-screen relative" style={{ background: currentTheme.background.default, color: currentTheme.text.primary }}>
            <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
            {loading ? (
                <Loader type="card" count={2} />
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card title="Class" variant="secondary"><span className="text-lg font-semibold">{teacherClass}</span></Card>
                        <Card title="Grade" variant="secondary"><span className="text-lg font-semibold">{teacherGrade}</span></Card>
                        <Card title="Students" variant="secondary"><span className="text-lg font-semibold">{students.length}</span></Card>
                        <Card title="Average Grade" variant="secondary"><span className="text-lg font-semibold">{averageGrade}</span></Card>
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
                {modalContent === 'add-grade' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Add Grade (Coming Soon)</h2>
                        <p className="text-gray-500">This feature will allow teachers to add grades for students.</p>
                    </div>
                )}
                {modalContent === 'print-class' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Print Class List</h2>
                        <p className="text-gray-500">Use your browser's print function to print this page.</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TeacherDashboard;
