import React, { useEffect, useState } from 'react';
import { fetchUserId } from '../api/userApi';
import { fetchTeacherClassAndGrade } from '../api/academicApi';
import supabase from '../../db/SupaBaseConfig';
import Loader from '../ui/loader';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';

const Attendance = () => {
    const { addToast } = useToast();
    const { currentTheme } = useTheme();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formState, setFormState] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [termId, setTermId] = useState('');
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch terms for selection
                const { data: termsData, error: termsError } = await supabase
                    .from('Terms')
                    .select('id, name, startDate, endDate')
                    .order('startDate', { ascending: false });
                if (termsError) throw termsError;
                setTerms(termsData || []);
                if (termsData && termsData.length > 0) setTermId(termsData[0].id);

                const userId = await fetchUserId();
                const classData = await fetchTeacherClassAndGrade(userId);
                // Get all students in this class
                const { data: studentsData, error: studentsError } = await supabase
                    .from('Students')
                    .select('id, FirstNames, Surname')
                    .eq('Grade', classData.grade)
                    .eq('Class', classData.class);
                if (studentsError) throw studentsError;
                setStudents(studentsData || []);
                // Initialize form state
                const initialState = {};
                (studentsData || []).forEach(s => {
                    initialState[s.id] = { Status: 'present', Comment: '' };
                });
                setFormState(initialState);
            } catch (err) {
                setError('Failed to fetch students.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (studentId, field, value) => {
        setFormState(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e, studentId) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { Status, Comment } = formState[studentId];
            await supabase.from('Attendance').insert([
                {
                    StudentId: studentId,
                    Status,
                    Comment,
                    Date: date,
                    TermId: termId
                }
            ]);
            addToast('Attendance saved!', 'success');
        } catch (err) {
            setError('Failed to submit attendance.');
            addToast('Failed to save attendance.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBulkSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const records = students.map(s => ({
                StudentId: s.id,
                Status: formState[s.id]?.Status || 'present',
                Comment: formState[s.id]?.Comment || '',
                Date: date,
                TermId: termId
            }));
            await supabase.from('Attendance').insert(records);
            addToast('Attendance saved for all students!', 'success');
        } catch (err) {
            setError('Failed to save attendance for all students.');
            addToast('Failed to save attendance for all students.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-2 sm:p-4 md:p-6" style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}>
            <h2 className="text-xl font-bold mb-4">Attendance</h2>
            {loading ? <Loader type="card" count={1} /> : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    {/* Date and Term selection */}
                    <form onSubmit={handleBulkSave} className="mb-4 flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                className="border p-1 rounded w-full min-w-[120px]"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                                style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Term</label>
                            <select
                                className="border p-1 rounded w-full min-w-[120px]"
                                value={termId}
                                onChange={e => setTermId(e.target.value)}
                                required
                                style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }}
                            >
                                <option value="">Select Term</option>
                                {terms.map(term => (
                                    <option key={term.id} value={term.id}>
                                        {term.name} ({term.startDate?.slice(0,10)} - {term.endDate?.slice(0,10)})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded font-semibold shadow"
                            style={{ background: currentTheme.primary?.main, color: currentTheme.primary?.contrastText }}
                            disabled={submitting || !termId}
                        >
                            Bulk Save All
                        </button>
                    </form>
                    <form>
                        <div className="flex flex-wrap font-semibold border-b pb-2 mb-2">
                            <div className="w-1/2 sm:w-1/4">Name</div>
                            <div className="w-1/2 sm:w-1/4">Status</div>
                            <div className="w-full sm:w-1/2">Comment</div>
                            <div className="w-24 hidden sm:block"></div>
                        </div>
                        {students.map(student => (
                            <div key={student.id} className="flex flex-wrap items-center border-b py-2">
                                <div className="w-1/2 sm:w-1/4 truncate">{student.FirstNames} {student.Surname}</div>
                                <div className="w-1/2 sm:w-1/4 flex gap-2 flex-wrap">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name={`status-${student.id}`}
                                            value="present"
                                            checked={formState[student.id]?.Status === 'present'}
                                            onChange={() => handleChange(student.id, 'Status', 'present')}
                                        />
                                        <span className="ml-1">Present</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name={`status-${student.id}`}
                                            value="absent"
                                            checked={formState[student.id]?.Status === 'absent'}
                                            onChange={() => handleChange(student.id, 'Status', 'absent')}
                                        />
                                        <span className="ml-1">Absent</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name={`status-${student.id}`}
                                            value="excused"
                                            checked={formState[student.id]?.Status === 'excused'}
                                            onChange={() => handleChange(student.id, 'Status', 'excused')}
                                        />
                                        <span className="ml-1">Excused</span>
                                    </label>
                                </div>
                                <div className="w-full sm:w-1/2 mt-2 sm:mt-0">
                                    <input
                                        type="text"
                                        className="border p-1 w-full rounded"
                                        placeholder="Comment"
                                        value={formState[student.id]?.Comment || ''}
                                        onChange={e => handleChange(student.id, 'Comment', e.target.value)}
                                        style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }}
                                    />
                                </div>
                                <div className="w-full sm:w-24 flex justify-end mt-2 sm:mt-0">
                                    <button
                                        type="submit"
                                        className="px-3 py-1 rounded font-semibold shadow"
                                        style={{ background: currentTheme.primary?.main, color: currentTheme.primary?.contrastText }}
                                        disabled={submitting}
                                        onClick={e => handleSubmit(e, student.id)}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ))}
                    </form>
                </div>
            )}
        </div>
    );
};

export default Attendance;
