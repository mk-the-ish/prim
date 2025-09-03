import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { fetchUser } from '../../components/api/userApi';
import { fetchStudentDetails } from '../api/studentsInfoApi';
import { useTheme } from '../../contexts/ThemeContext';

const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
    header: { fontSize: 16, marginBottom: 10 },
    table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1 },
    tableRow: { flexDirection: 'row' },
    tableCol: { width: '33%', borderStyle: 'solid', borderWidth: 1, padding: 5 },
    tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
    text: { fontSize: 12, marginBottom: 5 }
});

const InvoicePDF = ({ students }) => (
    <Document>
        {students.map(student => (
            <Page key={student.id} size="A4" style={styles.page}>
                <Text style={styles.title}>Invoice for {student.FirstNames} {student.Surname}</Text>

                <View style={styles.header}>
                    <Text>Student ID: {student.id}</Text>
                    <Text>Grade: {student.Grade}</Text>
                    <Text>Class: {student.Class}</Text>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={styles.tableCol}><Text>Terms</Text></View>
                        <View style={styles.tableCol}><Text>Tuition</Text></View>
                        <View style={styles.tableCol}><Text>Levy</Text></View>
                    </View>

                    {['Term 1', 'Term 2', 'Term 3'].map(term => (
                        <View key={term} style={styles.tableRow}>
                            <View style={styles.tableCol}><Text>{term}</Text></View>
                            <View style={styles.tableCol}>
                                <Text>${(student.Tuition_Owing / 3).toFixed(2)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>${(student.Levy_Owing / 3).toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}

                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}><Text>Total</Text></View>
                        <View style={styles.tableCol}>
                            <Text>${student.Tuition_Owing.toFixed(2)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>${student.Levy_Owing.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        ))}
    </Document>
);

const BulkInvoicing = () => {
    const navigate = useNavigate();
    const [gradeFilter, setGradeFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 50;
    const { currentTheme } = useTheme();

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login'),
        onSuccess: (data) => {
            if (!data) {
                navigate('/unauthorised');
            }
        }
    });

    const { data: studentData = {}, isLoading: studentsLoading } = useQuery({
        queryKey: ['studentsInvoicing', { gradeFilter, classFilter, page }],
        queryFn: () => fetchStudentDetails({ gradeFilter, classFilter, page, pageSize: PAGE_SIZE })
    });

    const { students = [], totalPages = 1 } = studentData;
    const loading = userLoading || studentsLoading;

    return (
        <div className="min-h-screen" style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}>
            <div className="py-4 px-6 flex justify-between items-center" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}>
                <Link to="/profile" className="flex items-center hover:opacity-80 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userData?.name || 'Profile'}</span>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">Bulk Invoicing</h1>
                <Link
                    to="/dashboard"
                    className="hover:opacity-80 transition-colors duration-200"
                    style={{ color: currentTheme.text?.primary }}
                >
                    Back to Dashboard
                </Link>
            </div>
            {/* Filters */}
            <div className="pt-20 px-6 pb-6">
                <div className="mb-6 flex space-x-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Filter by Grade</label>
                        <input
                            type="text"
                            value={gradeFilter}
                            onChange={(e) => setGradeFilter(e.target.value)}
                            placeholder="Enter Grade"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
                            style={{
                                background: currentTheme.background?.paper,
                                color: currentTheme.text?.primary,
                                borderColor: currentTheme.divider
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Filter by Class</label>
                        <input
                            type="text"
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            placeholder="Enter Class"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
                            style={{
                                background: currentTheme.background?.paper,
                                color: currentTheme.text?.primary,
                                borderColor: currentTheme.divider
                            }}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}>
                    <PDFDownloadLink
                        document={<InvoicePDF students={students} />}
                        fileName="student_invoices.pdf"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-6 inline-block"
                    >
                        {({ loading }) => loading ? 'Preparing PDF...' : 'Download Invoices PDF'}
                    </PDFDownloadLink>

                    {loading ? (
                        <p>Loading...</p>
                    ) : students.length === 0 ? (
                        <p>No students found.</p>
                    ) : (
                        <div className="space-y-8">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="p-4 border rounded-lg shadow-sm"
                                    style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary, borderColor: currentTheme.divider }}
                                >
                                    <h2 className="text-xl font-bold mb-4">Student Invoice</h2>
                                    <p><strong>Student ID:</strong> {student.id}</p>
                                    <p><strong>Full Name:</strong> {student.FirstNames} {student.Surname}</p>
                                    <p><strong>Grade:</strong> {student.Grade}</p>
                                    <p><strong>Class:</strong> {student.Class}</p>
                                    <p><strong>Levy Owed:</strong> ${student.Levy_Owing?.toFixed(2) || '0.00'}</p>
                                    <p><strong>Tuition Owed:</strong> ${student.Tuition_Owing?.toFixed(2) || '0.00'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg ${page === totalPages ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>     
    );
};

export default BulkInvoicing;