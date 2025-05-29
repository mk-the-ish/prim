import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../../db/SupaBaseConfig';

const Invoice = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const { data: studentData, error } = await supabase
                .from('Students')
                .select('id, FirstNames, Surname, Grade, Class, Levy_Owing, Tuition_Owing')
                .eq('id', studentId)
                .single();

            if (error) throw error;
            setStudent(studentData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student data:', error);
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <p>Loading...</p>;
    if (!student) return <p>Student not found.</p>;

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Student Invoice</h2>
            <div className="space-y-4">
                <p><strong>Student ID:</strong> {student.id}</p>
                <p><strong>Full Name:</strong> {student.FirstNames} {student.Surname}</p>
                <p><strong>Grade:</strong> {student.Grade}</p>
                <p><strong>Class:</strong> {student.Class}</p>
                <p><strong>Levy Owed:</strong> ${student.Levy_Owing?.toFixed(2) || '0.00'}</p>
                <p><strong>Tuition Owed:</strong> ${student.Tuition_Owing?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Print Invoice
                </button>
                <button
                    onClick={() => navigate(`/student-view/${studentId}`)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Back to Student View
                </button>
            </div>
        </div>
    );
};

export default Invoice;