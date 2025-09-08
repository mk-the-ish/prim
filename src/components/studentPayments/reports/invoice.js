import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import supabase from '../../../db/SupaBaseConfig';

const Invoice = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const componentRef = useRef();

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const { data: studentData, error } = await supabase
                .from('Students')
                .select('id, firstNames, surname, grade, class, levyOwing, tuitionOwing')
                .eq('id', studentId)
                .single();

            if (error) throw error;
            setStudent(studentData);
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Invoice_for_${student?.firstNames}_${student?.surname}`,
    });

    if (loading) return <p>Loading...</p>;
    if (!student) return <p>Student not found.</p>;

    return (
        <div className="flex flex-col items-center">
            {/* Action Buttons - outside of the print area */}
            <div className="mt-10 mb-5 flex justify-center space-x-4">
                <button
                    onClick={handleDownloadPdf}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Download PDF
                </button>
                <button
                    onClick={() => navigate(`/student-view/${studentId}`)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Back to Student View
                </button>
            </div>

            {/* The invoice content, wrapped in the referenced div */}
            <div ref={componentRef} className="max-w-3xl mx-auto p-8 bg-white border border-gray-300 shadow-md">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <img src="/images/makomoLogo.png" alt="School Logo" className="w-30 h-24" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-bold">MAKOMO COUNCIL PRIMARY SCHOOL</h1>
                        <p className="text-md">P.O.BOX EP 3</p>
                        <p className="text-md">EPWORTH ZIMPOST</p>
                        <p className="text-md">HARARE Tel: (04)2937464</p>
                    </div>
                    <div>
                        <img src="/images/councilLogo.png" alt="Council Logo" className="w-30 h-24 mt-2" />
                    </div>
                </div>

                {/* Invoice Details Section */}
                <div className="border-b-2 border-gray-400 pb-4 mb-4">
                    <h2 className="text-2xl font-bold mb-2">
                        Invoice for {student.firstNames} {student.surname}
                    </h2>
                    <p className="font-semibold text-lg">{student.grade} {student.class}</p>
                    <div className="mt-4 text-sm">
                        <p className="flex justify-between">
                            <span className="font-bold">Quote Date:</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-bold">Invoice Number:</span>
                            <span>MK{student.id?.toString().slice(-6)}</span>
                        </p>
                    </div>
                </div>

                {/* Description and Amount Table */}
                <div className="mb-8">
                    <div className="grid grid-cols-2 text-left font-bold border-b border-gray-400 pb-2">
                        <p>Description</p>
                        <p className="text-right">Amount (USD)</p>
                    </div>
                    <div className="grid grid-cols-2 text-left py-2 border-b border-gray-200">
                        <p>Levy</p>
                        <p className="text-right">${student.levyOwing?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="grid grid-cols-2 text-left py-2 border-b border-gray-200">
                        <p>Tuition</p>
                        <p className="text-right">${student.tuitionOwing?.toFixed(2) || '0.00'}</p>
                    </div>
                </div>
                
                {/* Banking Details Section */}
                <div>
                    <h3 className="text-lg font-bold mb-2">Banking Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-bold">LEVY</p>
                            <p>Bank: CBZ</p>
                            <p>Branch: Virtual</p>
                            <p>Account No: 12626321850029-USD</p>
                            <p className="ml-20">12626321850019-ZIG</p>
                        </div>
                        <div>
                            <p className="font-bold">TUITION</p>
                            <p>Bank: ZB Bank</p>
                            <p>Branch: Graniteside</p>
                            <p>Account No: 41200851868405-USD</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;