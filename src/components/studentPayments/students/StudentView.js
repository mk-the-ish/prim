import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import { fetchStudentById, fetchStudentPayments } from '../../api/studentsInfoApi';
import supabase from '../../../db/SupaBaseConfig';
import Loader from '../../ui/loader';
import DataTable from '../../ui/dataTable';
import Button from '../../ui/button';
import TopBar from '../../ui/topbar';
import Card from '../../ui/card';
import FormModal from '../../ui/FormModal';
import StudentUpdate from './student_update';
import FeesModal from './FeesModal';

const TABS = [
    { key: 'info', label: 'Personal Info' },
    { key: 'payments', label: 'Payment History' },
    // Future tabs can be added here
];

const StudentView = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState(null); // null | 'update'
    const [showFeesModal, setShowFeesModal] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    // Fetch student info
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const studentData = await fetchStudentById(studentId);
                setStudent(studentData || null);

                const paymentsData = await fetchStudentPayments(studentId);
                setPayments(paymentsData || []);
            } catch (error) {
                addToast('Failed to fetch student or payments.', 'error');
                setStudent(null);
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId, addToast]);

    // Delete student logic
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        setLoading(true);
        try {
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

    // Payment table columns (matching DB schema)
    const columns = [
        { header: 'Date', accessor: 'created_at', render: row => new Date(row.created_at).toLocaleDateString() },
        { header: 'Type', accessor: 'feesType' },
        { header: 'Currency', accessor: 'currency' },
        { header: 'Amount', accessor: 'amount', render: row => `$${Number(row.amount).toFixed(2)}` },
        { header: 'Receipt', accessor: 'receiptNumber' },
        { header: 'Form', accessor: 'paymentForm' },
        { header: 'Account', accessor: 'accountId' }
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
            <TopBar title="Student Details" userName={student?.firstNames || ''} />
            <div className="pt-8 px-6 pb-6">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <Loader type="card" count={1} />
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto">
                        {/* Tabs */}
                        <div className="flex border-b mb-6">
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    className={`px-6 py-2 font-semibold focus:outline-none ${
                                        activeTab === tab.key
                                            ? 'border-b-2 border-blue-600 text-blue-600'
                                            : 'text-gray-500'
                                    }`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {/* Tab Content */}
                        <div>
                            {activeTab === 'info' && (
                                <Card title="Personal Information" className="mb-6">
                                    <div className="space-y-2 text-justify">
                                        <p><strong>Student ID:</strong> {student.id}</p>
                                        <p><strong>Full Name:</strong> {student.firstNames} {student.surname}</p>
                                        <p><strong>Gender:</strong> {student.gender}</p>
                                        <p><strong>Grade:</strong> {student.grade}</p>
                                        <p><strong>Class:</strong> {student.class}</p>
                                        <p><strong>Contact Info:</strong> {student.contactInfo}</p>
                                        <p><strong>Address:</strong> {student.address}</p>
                                        <p><strong>Date of Birth:</strong> {student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</p>
                                        <p><strong>Sponsor:</strong> {student.sponsor}</p>
                                        <p><strong>Status:</strong> {student.status}</p>
                                        <p><strong>Levy Owed:</strong> ${student.levyOwing?.toFixed(2) || '0.00'}</p>
                                        <p><strong>Tuition Owed:</strong> ${student.tuitionOwing?.toFixed(2) || '0.00'}</p>
                                        <p><strong>Exam Fee:</strong> ${student.examFee?.toFixed(2) || '0.00'}</p>
                                        <p><strong>Other Owed:</strong> ${student.otherOwing?.toFixed(2) || '0.00'}</p>
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
                            )}
                            {activeTab === 'payments' && (
                                <Card
                                    title="Payment History"
                                    headerAction={
                                        <Button
                                            onClick={() => setShowFeesModal(true)}
                                            variant="primary"
                                            className="flex items-center"
                                        >
                                            <FaPlus className="mr-2" />
                                            Add Payment
                                        </Button>
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
                            )}
                            {/* Future tabs can be added here */}
                        </div>
                        {/* FormModal for update */}
                        <FormModal
                            open={modalType === 'update'}
                            onClose={() => setModalType(null)}
                            title="Update Student"
                        >
                            {modalType === 'update' && <StudentUpdate studentId={studentId} onSuccess={() => setModalType(null)} />}
                        </FormModal>
                        {/* FeesModal for payments */}
                        <FeesModal
                            open={showFeesModal}
                            onClose={() => setShowFeesModal(false)}
                            studentId={studentId}
                            onSubmit={async () => {
                                addToast('Payment added!', 'success');
                                setShowFeesModal(false);
                                // Refetch payments
                                const paymentsData = await fetchStudentPayments(studentId);
                                setPayments(paymentsData || []);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentView;