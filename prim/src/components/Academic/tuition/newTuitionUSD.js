import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../../SupaBaseConfig';

const NewTuitionUSD = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        StudentID: studentId,
        Date: '',
        Amount: '',
        transaction_type: '',
        reference: '',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Insert the payment into the tuition_usd table
            const { error: insertError } = await supabase.from('tuition_usd').insert([formData]);
            if (insertError) throw insertError;

            // Fetch the current Tuition_Owing value for the student
            const { data: studentData, error: fetchError } = await supabase
                .from('Students')
                .select('Tuition_Owing')
                .eq('id', studentId)
                .single();
            if (fetchError) throw fetchError;

            // Calculate the new Tuition_Owing value
            const newTuitionOwing = (studentData.Tuition_Owing || 0) - parseFloat(formData.Amount);

            // Update the Tuition_Owing column in the Students table
            const { error: updateError } = await supabase
                .from('Students')
                .update({ Tuition_Owing: newTuitionOwing })
                .eq('id', studentId);
            if (updateError) throw updateError;

            alert('Payment added successfully, and Tuition Owing updated!');
            navigate(`/student-view/${studentId}`); // Redirect back to the student view page
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Failed to process payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Add New USD Tuition Payment</h2>
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
                    <label className="block text-sm font-medium mb-1 text-left">Transaction Type</label>
                    <select
                        name="transaction_type"
                        value={formData.transaction_type}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Transaction Type</option>
                        <option value="cash">cash</option>
                        <option value="transfer">transfer</option>
                        <option value="misplaced transfer">misplaced transfer</option>
                    </select>
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

export default NewTuitionUSD;