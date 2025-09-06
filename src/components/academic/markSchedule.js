
import React, { useEffect, useState } from 'react';
import { fetchUserId } from '../api/userApi';
import { fetchTeacherClassAndGrade, fetchClassGrades } from '../api/academicApi';
import Loader from '../ui/loader';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';

const MarkSchedule = () => {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [classInfo, setClassInfo] = useState({ grade: '', class: '' });
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId = await fetchUserId();
                const classData = await fetchTeacherClassAndGrade(userId);
                setClassInfo(classData);
                const classGrades = await fetchClassGrades(classData.grade, classData.class);
                setGrades(classGrades || []);
            } catch (err) {
                setError('Failed to fetch class grades.');
                addToast('Failed to fetch class grades.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addToast]);

    return (
        <div className="p-2 sm:p-4 md:p-6" style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}>
            <h2 className="text-xl font-bold mb-4">Mark Schedule for {classInfo.grade} {classInfo.class}</h2>
            {loading ? <Loader type="card" count={1} /> : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded overflow-hidden text-sm">
                        <thead style={{ background: currentTheme.background?.paper }}>
                            <tr>
                                <th className="border px-2 py-1">Student ID</th>
                                <th className="border px-2 py-1">Term ID</th>
                                <th className="border px-2 py-1">EngP1;</th>
                                <th className="border px-2 py-1">EngP2</th>
                                <th className="border px-2 py-1">MathP1</th>
                                <th className="border px-2 py-1">MathP2</th>
                                <th className="border px-2 py-1">MathProj</th>
                                <th className="border px-2 py-1">Total</th>
                                <th className="border px-2 py-1">Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.length === 0 ? (
                                <tr><td colSpan={9} className="text-center py-2">No grades found.</td></tr>
                            ) : grades.map((g, idx) => (
                                <tr key={idx} style={{ background: idx % 2 === 0 ? currentTheme.background?.secondary : currentTheme.background?.paper }}>
                                    <td className="border px-2 py-1">{g.StudentID}</td>
                                    <td className="border px-2 py-1">{g.TermID}</td>
                                    <td className="border px-2 py-1">{g.EngP1}</td>
                                    <td className="border px-2 py-1">{g.EngP2}</td>
                                    <td className="border px-2 py-1">{g.MathP1}</td>
                                    <td className="border px-2 py-1">{g.MathP2}</td>
                                    <td className="border px-2 py-1">{g.MathProj}</td>
                                    <td className="border px-2 py-1">{g.Total}</td>
                                    <td className="border px-2 py-1">{g.Comments}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MarkSchedule;
