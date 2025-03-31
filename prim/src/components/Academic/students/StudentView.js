import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';
import { useParams, useNavigate } from 'react-router-dom';

const StudentView = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [levyUsdPayments, setLevyUsdPayments] = useState([]);
    const [levyZwgPayments, setLevyZwgPayments] = useState([]);
    const [tuitionUsdPayments, setTuitionUsdPayments] = useState([]);
    const [tuitionZwgPayments, setTuitionZwgPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const { data: studentData, error: studentError } = await supabase
                .from('Students')
                .select('*')
                .eq('id', studentId)
                .single();

            if (studentError) throw studentError;
            setStudent(studentData);

            const { data: levyUsdData } = await supabase
                .from('levy_usd')
                .select('*')
                .eq('StudentID', studentId)
                .order('Date', { ascending: false });
            setLevyUsdPayments(levyUsdData || []);

            const { data: levyZwgData } = await supabase
                .from('levy_zwg')
                .select('*')
                .eq('StudentID', studentId)
                .order('Date', { ascending: false });
            setLevyZwgPayments(levyZwgData || []);

            const { data: tuitionUsdData } = await supabase
                .from('tuition_usd')
                .select('*')
                .eq('StudentID', studentId)
                .order('Date', { ascending: false });
            setTuitionUsdPayments(tuitionUsdData || []);

            const { data: tuitionZwgData } = await supabase
                .from('tuition_zwg')
                .select('*')
                .eq('StudentID', studentId)
                .order('Date', { ascending: false });
            setTuitionZwgPayments(tuitionZwgData || []);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching student data:', error);
            setLoading(false);
        }
    };

    const newLevyUSD = () => navigate(`/newLevyUSD/${studentId}`);
    const newLevyZWG = () => navigate(`/newLevyZWG/${studentId}`);
    const newTuitionUSD = () => navigate(`/newTuitionUSD/${studentId}`);
    const newTuitionZWG = () => navigate(`/newTuitionZWG/${studentId}`);

    const handleUpdate = () => navigate(`/student_update/${studentId}`);
    const handleInvoice = () => navigate(`/invoice/${studentId}`);
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            const { error } = await supabase.from('Students').delete().eq('id', studentId);
            if (error) {
                console.error('Error deleting student:', error);
            } else {
                navigate('/students');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!student) return <p>Student not found.</p>;

    return (
        <div className="flex space-x-4">
            {/* Left Panel: Student Details */}
            <div className="w-1/3 p-6 bg-gray-100 border rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Student Details</h2>
                <div className="space-y-2 text-justify">
                    <p><strong>Student ID:</strong> {student.id}</p>
                    <p><strong>Full Name:</strong> {student.FirstNames} {student.Surname}</p>
                    <p><strong>Gender:</strong> {student.Gender}</p>
                    <p><strong>Grade:</strong> {student.Grade}</p>
                    <p><strong>Class:</strong> {student.Class}</p>
                    <p><strong>Contact Info:</strong> {student.ContactInfo}</p>
                    <p><strong>Address:</strong> {student.Address}</p>
                    <p><strong>Date of Birth:</strong> {new Date(student.DOB).toLocaleDateString()}</p>
                    <p><strong>Sponsor:</strong> {student.Sponsor}</p>
                    <p><strong>Levy Owed:</strong> ${student.Levy_Owing?.toFixed(2) || '0.00'}</p>
                    <p><strong>Tuition Owed:</strong> ${student.Tuition_Owing?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                    <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Update
                    </button>
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>
                    <button onClick={handleInvoice} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Invoice
                    </button>
                </div>
            </div>

            {/* Middle Panel: Levy */}
            <div className="w-2/3 p-6 bg-gray-100 border rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Levy Payments</h2>
                {/* Levy USD */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">USD Payments</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {levyUsdPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">${payment.Amount.toFixed(2)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.transaction_type}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.reference}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mt-2">
                        <button onClick={newLevyUSD} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                            Add Payment
                        </button>
                    </div>
                </div>
                {/* Levy ZWG */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">ZWG Payments</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {levyZwgPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">${payment.Amount.toFixed(2)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.reference}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mt-2">
                        <button onClick={newLevyZWG} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                            Add Payment
                        </button>
                    </div>
                </div>
            </div>
            {/* Right Panel: Tuition */}
            <div className="w-3/3 p-6 bg-gray-100 border rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Tuition Payments</h2>
                {/* Tuition USD */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">USD Payments</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tuitionUsdPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">${payment.Amount.toFixed(2)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.transaction_type}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.reference}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mt-2">
                        <button onClick={newTuitionUSD} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                            Add Payment
                        </button>
                    </div>
                </div>
                {/* Levy ZWG */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">ZWG Payments</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tuitionUsdPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">${payment.Amount.toFixed(2)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{payment.reference}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mt-2">
                        <button onClick={newTuitionZWG} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                            Add Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentView;