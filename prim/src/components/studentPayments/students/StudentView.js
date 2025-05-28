import React, { useState, useEffect } from 'react';
import supabase from '../../../SupaBaseConfig';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const StudentView = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [levyUsdPayments, setLevyUsdPayments] = useState([]);
    const [levyZwgPayments, setLevyZwgPayments] = useState([]);
    const [tuitionUsdPayments, setTuitionUsdPayments] = useState([]);
    const [tuitionZwgPayments, setTuitionZwgPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const initialize = async () => {
            await fetchUserName();
            await fetchStudentData();
        };
        initialize();
    }, [studentId]);

    const fetchUserName = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/dashboard');
                return;
            }

            const { data, error } = await supabase
                .from('user_roles')
                .select('name, role')
                .eq('id', user.id)
                .maybeSingle();

            if (error) throw error;

            setUserName(data.name);
            setUserRole(data.role);

            if (!['admin', 'bursar'].includes(data.role)) {
                navigate('/unauthorised');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            navigate('/dashboard');
        }
    };

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading student data...</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Student Not Found</h2>
                    <p className="text-gray-600">The requested student could not be found.</p>
                    <button
                        onClick={() => navigate('/students')}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Back to Students
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 relative">
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userName || 'Profile'}</span>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">Students</h1>
                <button
                    onClick={() => navigate('/students')}
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                >
                    Back to List
                </button>
            </div>

            {/* Main Content*/}
            <div className="pt-8 px-6 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel: Student Details */}
                    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-center">Student Details</h2>
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
                            {['admin', 'bursar'].includes(userRole) && (
                                <>
                                    <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Update
                                    </button>
                                    <button onClick={handleInvoice} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                        Invoice
                                    </button>
                                </>
                            )}
                            {userRole === 'admin' && (
                                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Middle Panel: Levy */}
                    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Levy Payments</h2>
                        {/* Levy USD */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">USD Payments</h3>
                            <div className="overflow-x-auto shadow-md rounded-lg">
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
                            </div>
                            <div className="flex justify-end mt-2">
                                {['admin', 'bursar'].includes(userRole) && (
                                    <button onClick={newLevyUSD} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                                        Add Payment
                                    </button>)}
                            </div>
                        </div>
                        {/* Levy ZWG */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">ZWG Payments</h3>
                            <div className="overflow-x-auto shadow-md rounded-lg">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {levyZwgPayments.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td className="px-4 py-4 whitespace-nowrap">{payment.id}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap">${payment.Amount.toFixed(2)}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap">${payment.USD_equivalent?.toFixed(2) || '0.00'}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap">{payment.reference}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            </div>
                                {['admin', 'bursar'].includes(userRole) && (
                                    <button onClick={newLevyZWG} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                                        Add Payment
                                    </button>)}
                            </div>
                        </div>
                    </div>
                    {/* Right Panel: Tuition */}
                    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">Tuition Payments</h2>
                        {/* Tuition USD */}
                        <div className="mb-2">
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
                                {['admin', 'bursar'].includes(userRole) && (
                                    <button onClick={newTuitionUSD} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                                        Add Payment
                                    </button>)}
                            </div>
                        </div>
                        {/* Tuition ZWG */}
                        <div className="mb-2">
                            <h3 className="text-lg font-semibold mb-2">ZWG Payments</h3>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tuitionZwgPayments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-4 py-4 whitespace-nowrap">{payment.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">${payment.Amount.toFixed(2)}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">${payment.USD_equivalent?.toFixed(2) || '0.00'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">{payment.reference}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end mt-2">
                                {['admin', 'bursar'].includes(userRole) && (
                                    <button onClick={newTuitionZWG} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                                        Add Payment
                                    </button>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    );
};

export default StudentView;