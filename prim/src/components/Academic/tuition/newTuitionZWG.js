import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../../SupaBaseConfig';

const NewTuitionZWG = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        StudentID: studentId,
        Date: '',
        form: '',
        Amount: '',
        USD_equivalent: '',
        reference: '',
    });
    const [loading, setLoading] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error: insertError } = await supabase.from('tuition_zwg').insert([formData]);
            if (insertError) throw insertError;

            const { data: studentData, error: fetchError } = await supabase
                .from('Students')
                .select('FirstNames, Surname, Grade, Class, Tuition_Owing')
                .eq('id', studentId)
                .single();
            if (fetchError) throw fetchError;

            const newTuitionOwing = (studentData.Tuition_Owing || 0) - parseFloat(formData.USD_equivalent);

            const { error: updateError } = await supabase
                .from('Students')
                .update({ Tuition_Owing: newTuitionOwing })
                .eq('id', studentId);
            if (updateError) throw updateError;

            setReceiptData({
                ...formData,
                studentName: `${studentData.FirstNames} ${studentData.Surname}`,
                grade: studentData.Grade,
                className: studentData.Class,
                newTuitionOwing,
            });

            setTimeout(() => {
                window.print();
            }, 500);

            alert('Payment added successfully, and Tuition Owing updated!');
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Failed to process payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (receiptData) {
        return (
            <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Payment Receipt</h2>
                <p><strong>Student Name:</strong> {receiptData.studentName}</p>
                <p><strong>Grade:</strong> {receiptData.grade}</p>
                <p><strong>Class:</strong> {receiptData.className}</p>
                <p><strong>Student ID:</strong> {receiptData.StudentID}</p>
                <p><strong>Date:</strong> {receiptData.Date}</p>
                <p><strong>Amount:</strong> ${parseFloat(receiptData.Amount).toFixed(2)}</p>
                <p><strong>USD Equivalent:</strong> ${parseFloat(receiptData.USD_equivalent).toFixed(2)}</p>
                <p><strong>Reference:</strong> {receiptData.reference}</p>
                <p><strong>New Tuition Owing:</strong> ${receiptData.newTuitionOwing.toFixed(2)}</p>
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => navigate(`/student-view/${studentId}`)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Back to Student View
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Add New ZWG Tuition Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">Date</label>
                    <input
                        type="date"
                        name="Date"
                        value={formData.Date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">Payment Timeline</label>
                    <select
                        name="form"
                        value={formData.form}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Payment Timeline</option>
                        <option value="normal">normal</option>
                        <option value="prepayment">prepayment</option>
                        <option value="recovery">recovery</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">Amount</label>
                    <input
                        type="number"
                        name="Amount"
                        value={formData.Amount}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">USD Equivalent</label>
                    <input
                        type="number"
                        name="USD_equivalent"
                        value={formData.USD_equivalent}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">Reference</label>
                    <input
                        type="text"
                        name="reference"
                        value={formData.reference}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Payment'}
                </button>
            </form>
        </div>
    );
};

export default NewTuitionZWG;