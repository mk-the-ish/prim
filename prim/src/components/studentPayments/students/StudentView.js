import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaChevronDown } from 'react-icons/fa';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import { fetchUser } from '../../api/userApi';
import supabase from '../../../db/SupaBaseConfig';
import Loader from '../../ui/loader';
import DataTable from '../../ui/dataTable';
import Button from '../../ui/button';
import TopBar from '../../ui/topbar';
import Card from '../../ui/card';
import FormModal from '../../ui/FormModal';
import StudentUpdate from './student_update';
import NewLevyUSD from '../levy/newLevyUSD';
import NewLevyZWG from '../levy/newLevyZWG';
import NewTuitionUSD from '../tuition/newTuitionUSD';
import NewTuitionZWG from '../tuition/newTuitionZWG';

const StudentView = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [modalType, setModalType] = useState(null); // null | 'update' | 'levyUSD' | 'levyZWG' | 'tuitionUSD' | 'tuitionZWG'
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    // Fetch student and payments only (user info not needed for parent)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch student info
                const { data: studentData, error: studentError } = await supabase
                    .from('Students')
                    .select('*')
                    .eq('id', studentId)
                    .maybeSingle();
                if (studentError || !studentData) {
                    setStudent(null);
                } else {
                    setStudent(studentData);
                }

                // Fetch all payments for this student from Fees table
                const { data: paymentsData, error: paymentsError } = await supabase
                    .from('Fees')
                    .select('*')
                    .eq('StudentID', studentId)
                    .order('Date', { ascending: false });

                if (paymentsError) {
                    addToast('Failed to fetch payments.', 'error');
                    setPayments([]);
                } else {
                    setPayments(paymentsData || []);
                }
            } catch (error) {
                addToast('Failed to fetch student or payments.', 'error');
                setStudent(null);
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line
    }, [studentId]);

    // Delete student logic
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        setLoading(true);
        try {
            // Delete from Students table
            const { error } = await supabase
                .from('Students')
                .delete()
                .eq('id', studentId);
            if (error) throw error;
            addToast('Student deleted successfully.', 'success');
            navigate('/students');
        } catch (error) {
            addToast('Failed to delete student.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Table columns
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Date', render: row => new Date(row.Date).toLocaleDateString() },
        { header: 'Type', accessor: 'Type' },
        { header: 'Currency', accessor: 'Currency' },
        { header: 'Amount', render: row => `$${Number(row.Amount).toFixed(2)}` },
        { header: 'Reference', accessor: 'reference' },
        { header: 'Description', accessor: 'Description' },
    ];

    // Add Payment Menu
    const addPaymentOptions = [
        { label: 'Add Levy USD', onClick: () => setModalType('levyUSD') },
        { label: 'Add Levy ZWG', onClick: () => setModalType('levyZWG') },
        { label: 'Add Tuition USD', onClick: () => setModalType('tuitionUSD') },
        { label: 'Add Tuition ZWG', onClick: () => setModalType('tuitionZWG') },
    ];

    // Student not found
    if (!loading && !student) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card title="Student Not Found" className="max-w-md mx-auto text-center">
                    <p className="mb-4 text-gray-600">The requested student could not be found.</p>
                    <Button onClick={() => navigate('/students')} variant="primary">
                        Back to Students
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen"
            style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}
        >
            <TopBar title="Student Details" userName={userName} />
            <div className="pt-8 px-6 pb-6">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <Loader type="card" count={1} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Panel: Student Details */}
                        <Card title="Student Details" className="h-fit">
                            <div className="space-y-2 text-justify">
                                <p><strong>Student ID:</strong> {student.id}</p>
                                <p><strong>Full Name:</strong> {student.FirstNames} {student.Surname}</p>
                                <p><strong>Gender:</strong> {student.Gender}</p>
                                <p><strong>Grade:</strong> {student.Grade}</p>
                                <p><strong>Class:</strong> {student.Class}</p>
                                <p><strong>Contact Info:</strong> {student.ContactInfo}</p>
                                <p><strong>Address:</strong> {student.Address}</p>
                                <p><strong>Date of Birth:</strong> {student.DOB ? new Date(student.DOB).toLocaleDateString() : '-'}</p>
                                <p><strong>Sponsor:</strong> {student.Sponsor}</p>
                                <p><strong>Levy Owed:</strong> ${student.Levy_Owing?.toFixed(2) || '0.00'}</p>
                                <p><strong>Tuition Owed:</strong> ${student.Tuition_Owing?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="mt-6 flex flex-col gap-2">
                                <Button onClick={() => setModalType('update')} variant="primary">
                                    Update
                                </Button>
                                <Button onClick={() => navigate(`/invoice/${studentId}`)} variant="secondary">
                                    Invoice
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    variant="danger"
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>

                        {/* Middle & Right Panel: Payments Table */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <Card
                                title="All Payments"
                                headerAction={
                                    <div className="relative">
                                        <Button
                                            onClick={() => setShowAddMenu((v) => !v)}
                                            variant="primary"
                                            className="flex items-center"
                                        >
                                            <FaPlus className="mr-2" />
                                            Add Payment
                                            <FaChevronDown className="ml-2" />
                                        </Button>
                                        {showAddMenu && (
                                            <div
                                                className="absolute right-0 mt-2 bg-white rounded shadow-lg z-50"
                                                style={{
                                                    minWidth: 180,
                                                    background: currentTheme.background?.paper,
                                                    color: currentTheme.text?.primary
                                                }}
                                            >
                                                {addPaymentOptions.map((opt, idx) => (
                                                    <button
                                                        key={opt.label}
                                                        onClick={() => {
                                                            setShowAddMenu(false);
                                                            opt.onClick();
                                                        }}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                        style={{ background: 'none', color: currentTheme.text.primary }}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                }
                            >
                                <DataTable
                                    columns={columns}
                                    data={payments}
                                    currentPage={1}
                                    totalPages={1}
                                    itemsPerPage={payments.length}
                                    onPageChange={() => {}}
                                />
                            </Card>
                        </div>
                        {/* FormModal for update and payments */}
                        <FormModal
                            open={!!modalType}
                            onClose={() => setModalType(null)}
                            title={
                                modalType === 'update' ? 'Update Student' :
                                modalType === 'levyUSD' ? 'Add Levy USD' :
                                modalType === 'levyZWG' ? 'Add Levy ZWG' :
                                modalType === 'tuitionUSD' ? 'Add Tuition USD' :
                                modalType === 'tuitionZWG' ? 'Add Tuition ZWG' : ''
                            }
                        >
                            {modalType === 'update' && <StudentUpdate studentId={studentId} onSuccess={() => setModalType(null)} />}
                            {modalType === 'levyUSD' && <NewLevyUSD studentId={studentId} onSuccess={() => setModalType(null)} />}
                            {modalType === 'levyZWG' && <NewLevyZWG studentId={studentId} onSuccess={() => setModalType(null)} />}
                            {modalType === 'tuitionUSD' && <NewTuitionUSD studentId={studentId} onSuccess={() => setModalType(null)} />}
                            {modalType === 'tuitionZWG' && <NewTuitionZWG studentId={studentId} onSuccess={() => setModalType(null)} />}
                        </FormModal>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentView;