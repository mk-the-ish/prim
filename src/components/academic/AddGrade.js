import React, { useState } from 'react';
import supabase from '../../db/SupaBaseConfig';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';

const AddGrade = ({ studentId, termId, onSuccess }) => {
    const { addToast } = useToast();
    const { currentTheme } = useTheme();
    const [form, setForm] = useState({
        StudentID: studentId || '',
        TermID: termId || '',
        EngP1: '',
        EngP2: '',
        MathP1: '',
        MathP2: '',
        MathProj: '',
        IndP1: '',
        IndP2: '',
        IndProj: '',
        SSP1: '',
        SSP2: '',
        SSProj: '',
        STP1: '',
        STP2: '',
        STProj: '',
        PEP1: '',
        PEP2: '',
        PEProj: '',
        Total: '',
        Comments: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.from('Grades').insert([{ ...form, StudentID: Number(form.StudentID), TermID: Number(form.TermID), Total: Number(form.Total) }]);
            if (error) throw error;
            if (onSuccess) onSuccess();
            addToast('Grade saved!', 'success');
        } catch (err) {
            setError(err.message);
            addToast('Failed to save grade.', 'error');
        } finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-2 sm:p-4 max-w-xl mx-auto" style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}>
            <h2 className="text-lg font-bold mb-2">Add Grade</h2>
            {error && <div className="text-red-500">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input name="StudentID" value={form.StudentID} onChange={handleChange} placeholder="Student ID" className="border p-2 rounded" required style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="TermID" value={form.TermID} onChange={handleChange} placeholder="Term ID" className="border p-2 rounded" required style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="EngP1" value={form.EngP1} onChange={handleChange} placeholder="EngP1" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="EngP2" value={form.EngP2} onChange={handleChange} placeholder="EngP2" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="MathP1" value={form.MathP1} onChange={handleChange} placeholder="MathP1" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="MathP2" value={form.MathP2} onChange={handleChange} placeholder="MathP2" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="MathProj" value={form.MathProj} onChange={handleChange} placeholder="MathProj" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="IndP1" value={form.IndP1} onChange={handleChange} placeholder="IndP1" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="IndP2" value={form.IndP2} onChange={handleChange} placeholder="IndP2" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="IndProj" value={form.IndProj} onChange={handleChange} placeholder="IndProj" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="SSP1" value={form.SSP1} onChange={handleChange} placeholder="SSP1" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="SSP2" value={form.SSP2} onChange={handleChange} placeholder="SSP2" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="SSProj" value={form.SSProj} onChange={handleChange} placeholder="SSProj" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="STP1" value={form.STP1} onChange={handleChange} placeholder="STP1" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="STP2" value={form.STP2} onChange={handleChange} placeholder="STP2" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="STProj" value={form.STProj} onChange={handleChange} placeholder="STProj" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="PEP1" value={form.PEP1} onChange={handleChange} placeholder="PEP1" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="PEP2" value={form.PEP2} onChange={handleChange} placeholder="PEP2" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="PEProj" value={form.PEProj} onChange={handleChange} placeholder="PEProj" className="border p-2 rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
                <input name="Total" value={form.Total} onChange={handleChange} placeholder="Total" className="border p-2 rounded" required style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
            </div>
            <textarea name="Comments" value={form.Comments} onChange={handleChange} placeholder="Comments" className="border p-2 w-full rounded" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }} />
            <button type="submit" className="px-4 py-2 rounded font-semibold shadow w-full sm:w-auto" style={{ background: currentTheme.primary?.main, color: currentTheme.primary?.contrastText }} disabled={loading}>{loading ? 'Saving...' : 'Save Grade'}</button>
        </form>
    );
};

export default AddGrade;
