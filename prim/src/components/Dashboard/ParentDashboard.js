import React, { useEffect, useState } from 'react';
import StudentView from '../studentPayments/students/StudentView';
import { useTheme } from '../../contexts/ThemeContext';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStudentGrades } from '../api/academicApi';
import { fetchLinkedStudentIdsForParent } from '../api/studentsInfoApi';
import Card from '../ui/card';
import DataTable from '../ui/dataTable';
import Loader from '../ui/loader';

const ParentDashboard = () => {
    const { currentTheme } = useTheme();
    const { studentId: urlStudentId } = useParams();
    const [studentId, setStudentId] = useState(urlStudentId || null);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // On mount, if no studentId in URL, fetch from parent_student_link
    useEffect(() => {
        if (!urlStudentId) {
            (async () => {
                try {
                    const linkedIds = await fetchLinkedStudentIdsForParent();
                    if (linkedIds.length === 0) {
                        setError('No student linked to this parent account.');
                        setLoading(false);
                        return;
                    }
                    setStudentId(linkedIds[0]);
                    // Optionally, update the URL for deep-linking
                    navigate(`/parent-dashboard/${linkedIds[0]}`, { replace: true });
                } catch (err) {
                    setError('Failed to fetch linked student.');
                    setLoading(false);
                }
            })();
        }
    }, [urlStudentId, navigate]);

    // Fetch grades when studentId is available
    useEffect(() => {
        if (!studentId) return;
        const fetchGrades = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchStudentGrades(studentId);
                setGrades(data || []);
            } catch (err) {
                setError('Failed to fetch grades.');
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, [studentId]);

    // Define columns for grades table
    const gradeColumns = [
        { header: 'Term', accessor: 'Term' },
        { header: 'Subject', accessor: 'Subject' },
        { header: 'Grade', accessor: 'Grade' },
        { header: 'Comments', accessor: 'Comments' },
    ];

    return (
        <div
            className="min-h-screen"
            style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}
        >
            {/* Render StudentView in parent mode */}
            {studentId ? <StudentView role="parent" studentId={studentId} /> : null}
            {/* Grades Card */}
            <div className="max-w-5xl mx-auto mt-8">
                <Card title="Student Grades">
                    {loading ? (
                        <Loader type="card" count={1} />
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : grades.length === 0 ? (
                        <div className="text-gray-500">No grades found for this student.</div>
                    ) : (
                        <DataTable
                            columns={gradeColumns}
                            data={grades}
                            currentPage={1}
                            totalPages={1}
                            itemsPerPage={grades.length}
                            onPageChange={() => {}}
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ParentDashboard;
