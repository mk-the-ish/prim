import React, { useState, useEffect } from 'react';
import supabase from '../../SupaBaseConfig';
import { useParams, useNavigate } from 'react-router-dom';



const StudentView = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [levyUsdPayments, setLevyUsdPayments] = useState([]);
    const [levyZwgPayments, setLevyZwgPayments] = useState([]);
    const [tuitionUsdPayments, setTuitionUsdPayments] = useState([]);
    const [tuitionZwgPayments, setTuitionZwgPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLevyUsdForm, setShowLevyUsdForm] = useState(false);
    const [showLevyZwgForm, setShowLevyZwgForm] = useState(false);
    const [showTuitionUsdForm, setShowTuitionUsdForm] = useState(false);
    const [showTuitionZwgForm, setShowTuitionZwgForm] = useState(false);
    const [newLevyUsdPayment, setNewLevyUsdPayment] = useState({
        StudentID: studentId,
        Date: '',
        Amount: '',
    });
    const [newLevyZwgPayment, setNewLevyZwgPayment] = useState({
        StudentID: studentId,
        Date: '',
        Amount: '',
        USD_equivalent: '',
    });
    const [newTuitionUsdPayment, setNewTuitionUsdPayment] = useState({
        StudentID: studentId,
        Date: '',
        Amount: '',
    });
    const [newTuitionZwgPayment, setNewTuitionZwgPayment] = useState({
        StudentID: studentId,
        Date: '',
        Amount: '',
        USD_equivalent: '',
    });
    const navigate = useNavigate();


    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            // Fetch student details
            const { data: studentData, error: studentError } = await supabase
                .from('Students')
                .select('*')
                .eq('id', studentId)
                .single();

            if (studentError) throw studentError;
            setStudent(studentData);

            // Fetch levy USD payments
            const { data: levyUsdData, error: levyUsdError } = await supabase
                .from('levy_usd')
                .select('*')
                .eq('StudentID', studentId)
                .order('Date', { ascending: false });
            if (levyUsdError) console.error("Error fetching levy usd", levyUsdError);
            setLevyUsdPayments(levyUsdData || []);

            // Fetch levy ZWG payments
            const { data: levyZwgData, error: levyZwgError } = await supabase
                .from('levy_zwg')
                .select('*')
                .eq('StudentID', studentId)
                .order('Date', { ascending: false });
            if (levyZwgError) console.error("Error fetching levy zwg", levyZwgError);
            setLevyZwgPayments(levyZwgData || []);

            // Fetch tuition USD payments
            const { data: tuitionUsdData, error: tuitionUsdError } = await supabase
                .from('tuition_usd')
                .select('*')
                .eq('StudentID', studentId)
                .order('Date', { ascending: false });
            if (tuitionUsdError) console.error("Error fetching tuition usd", tuitionUsdError);
            setTuitionUsdPayments(tuitionUsdData || []);

            // Fetch tuition ZWG payments
            const { data: tuitionZwgData, error: tuitionZwgError } = await supabase
                .from('tuition_zwg')
                .select('*')
                .eq('StudentID', studentId)
                .order('Date', { ascending: false });
            if (tuitionZwgError) console.error("Error fetching tuition zwg", tuitionZwgError);
            setTuitionZwgPayments(tuitionZwgData || []);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching student data:', error);
            setLoading(false);
        }
    };

    // --- Levy USD Form Handlers ---
    const handleLevyUsdInputChange = (e) => {
        setNewLevyUsdPayment({ ...newLevyUsdPayment, [e.target.name]: e.target.value });
    };

    const handleAddLevyUsdPayment = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('levy_usd').insert([newLevyUsdPayment]);
        if (error) {
            console.error("Error adding levy usd payment", error);
        } else {
            await fetchStudentData(); // Refetch data to update tables
            setShowLevyUsdForm(false); // Hide the form
            setNewLevyUsdPayment({ StudentID: studentId, Date: '', Amount: '' }); // Reset form
        }
    };

    // --- Levy ZWG Form Handlers ---
    const handleLevyZwgInputChange = (e) => {
        setNewLevyZwgPayment({ ...newLevyZwgPayment, [e.target.name]: e.target.value });
    };

    const handleAddLevyZwgPayment = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('levy_zwg').insert([newLevyZwgPayment]);
        if (error) {
            console.error("Error adding levy zwg payment", error);
        } else {
            await fetchStudentData();
            setShowLevyZwgForm(false);
            setNewLevyZwgPayment({ StudentID: studentId, Date: '', Amount: '', USD_equivalent: '' });
        }
    };

    // --- Tuition USD Form Handlers ---
    const handleTuitionUsdInputChange = (e) => {
        setNewTuitionUsdPayment({ ...newTuitionUsdPayment, [e.target.name]: e.target.value });
    };

    const handleAddTuitionUsdPayment = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('tuition_usd').insert([newTuitionUsdPayment]);
        if (error) {
            console.error("Error adding tuition usd payment", error);
        } else {
            await fetchStudentData();
            setShowTuitionUsdForm(false);
            setNewTuitionUsdPayment({ StudentID: studentId, Date: '', Amount: '' });
        }
    };

    // --- Tuition ZWG Form Handlers ---
    const handleTuitionZwgInputChange = (e) => {
        setNewTuitionZwgPayment({ ...newTuitionZwgPayment, [e.target.name]: e.target.value });
    };

    const handleAddTuitionZwgPayment = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('tuition_zwg').insert([newTuitionZwgPayment]);
        if (error) {
            console.error("Error adding the tuition zwg payment", error);
        } else {
            await fetchStudentData();
            setShowTuitionZwgForm(false);
            setNewTuitionZwgPayment({ StudentID: studentId, Date: '', Amount: '', USD_equivalent: '' });
        }
    };

    const handleUpdate = () => {
        // Navigate to the student update page, passing the student ID
        navigate(`/student-update/${studentId}`);
    };

    const handleDelete = async () => {
        // Implement delete functionality (confirm with user first)
        if (window.confirm('Are you sure you want to delete this student?')) {
            const { error } = await supabase
                .from('Students')
                .delete()
                .eq('id', studentId);
            if (error) {
                console.error('Error deleting student:', error);
            } else {
                // Redirect to the students list page after successful deletion
                navigate('/students');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!student) return <p>Student not found.</p>;

    return (
        <div className="flex">
            {/* Left Panel: Student Details */}
            <div className="w-1/4 p-4 border-r">
                <h2 className="text-xl font-semibold mb-4">Student Details</h2>
                <p>
                    <strong>Student ID:</strong> {student.id}
                </p>
                <p>
                    <strong>Full Name:</strong> {student.FirstNames} {student.Surname}
                </p>
                <p>
                    <strong>Gender:</strong> {student.Gender}
                </p>
                <p>
                    <strong>Grade:</strong> {student.Grade}
                </p>
                <p>
                    <strong>Class:</strong> {student.Class}
                </p>
                <p>
                    <strong>Contact Info:</strong> {student.ContactInfo}
                </p>
                <p>
                    <strong>Address:</strong> {student.Address}
                </p>
                <p>
                    <strong>Date of Birth:</strong> {new Date(student.DOB).toLocaleDateString()}
                </p>
                <p>
                    <strong>Sponsor:</strong> {student.Sponsor}
                </p>
                <div className="mt-4">
                    <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Update
                    </button>
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>
                </div>
            </div>

            {/* Middle Panel: Levy */}
            <div className="w-1/2 p-4 border-r">
                <h2 className="text-xl font-semibold mb-4">Levy</h2>
                {/* Levy USD */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">USD Payments</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {levyUsdPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{payment.Amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => setShowLevyUsdForm(!showLevyUsdForm)} className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        {showLevyUsdForm ? 'Hide Form' : 'Add USD Payment'}
                    </button>
                    {showLevyUsdForm && (
                        <form onSubmit={handleAddLevyUsdPayment} className="mt-4">
                            <input
                                type="date"
                                name="Date"
                                value={newLevyUsdPayment.Date}
                                onChange={handleLevyUsdInputChange}
                                className="border p-2 mr-2"
                                required
                            />
                            <input
                                type="text"
                                name="Amount"
                                placeholder="Amount"
                                value={newLevyUsdPayment.Amount}
                                onChange={handleLevyUsdInputChange}
                                className="border p-2 mr-2"
                                required
                            />

                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add Payment
                            </button>
                        </form>
                    )}
                </div>
                {/* Levy ZWG */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">ZWG Payments</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {levyZwgPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{payment.Amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{payment.USD_equivalent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => setShowLevyZwgForm(!showLevyZwgForm)} className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        {showLevyZwgForm ? 'Hide Form' : 'Add ZWG Payment'}
                    </button>
                    {showLevyZwgForm && (
                        <form onSubmit={handleAddLevyZwgPayment} className="mt-4">
                            <input
                                type="date"
                                name="Date"
                                value={newLevyZwgPayment.Date}
                                onChange={handleLevyZwgInputChange}
                                className="border p-2 mr-2"
                                required
                            />
                            <input
                                type="text"
                                name="Amount"
                                placeholder="Amount"
                                value={newLevyZwgPayment.Amount}
                                onChange={handleLevyZwgInputChange}
                                className="border p-2 mr-2"
                                required
                            />
                            <input
                                type="text"
                                name="USD_equivalent"
                                placeholder="USD Equivalent"
                                value={newLevyZwgPayment.USD_equivalent}
                                onChange={handleLevyZwgInputChange}
                                className="border p-2 mr-2"
                                required
                            />

                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add Payment
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Right Panel: Tuition */}
            <div className="w-1/2 p-4">
                <h2 className="text-xl font-semibold mb-4">Tuition</h2>
                {/* Tuition USD */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">USD Payments</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tuitionUsdPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{payment.Amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => setShowTuitionUsdForm(!showTuitionUsdForm)} className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        {showTuitionUsdForm ? 'Hide Form' : 'Add USD Payment'}
                    </button>
                    {showTuitionUsdForm && (
                        <form onSubmit={handleAddTuitionUsdPayment} className="mt-4">
                            <input
                                type="date"
                                name="Date"
                                value={newTuitionUsdPayment.Date}
                                onChange={handleTuitionUsdInputChange}
                                className="border p-2 mr-2"
                                required
                            />
                            <input
                                type="text"
                                name="Amount"
                                placeholder="Amount"
                                value={newTuitionUsdPayment.Amount}
                                onChange={handleTuitionUsdInputChange}
                                className="border p-2 mr-2"
                                required
                            />

                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add Payment
                            </button>
                        </form>
                    )}
                </div>
                {/* Tuition ZWG */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">ZWG Payments</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tuitionZwgPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.Date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{payment.Amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{payment.USD_equivalent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => setShowTuitionZwgForm(!showTuitionZwgForm)} className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        {showTuitionZwgForm ? 'Hide Form' : 'Add ZWG Payment'}
                    </button>
                    {showTuitionZwgForm && (
                        <form onSubmit={handleAddTuitionZwgPayment} className="mt-4">
                            <input
                                type="date"
                                name="Date"
                                value={newTuitionZwgPayment.Date}
                                onChange={handleTuitionZwgInputChange}
                                className="border p-2 mr-2"
                                required
                            />
                            <input
                                type="text"
                                name="Amount"
                                placeholder="Amount"
                                value={newTuitionZwgPayment.Amount}
                                onChange={handleTuitionZwgInputChange}
                                className="border p-2 mr-2"
                                required
                            />
                            <input
                                type="text"
                                name="USD_equivalent"
                                placeholder="USD Equivalent"
                                value={newTuitionZwgPayment.USD_equivalent}
                                onChange={handleTuitionZwgInputChange}
                                className="border p-2 mr-2"
                                required
                            />

                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add Payment
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentView;
