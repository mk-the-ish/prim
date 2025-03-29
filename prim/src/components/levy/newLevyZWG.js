import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../SupaBaseConfig';

const NewLevyZWG = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        StudentID: studentId,
        Date: '',
        Amount: '',
        USD_equivalent: '',
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
            const { error } = await supabase.from('levy_zwg').insert([formData]);
            if (error) throw error;

            alert('Payment added successfully!');
            navigate(`/student-view/${studentId}`); // Redirect back to the student view page
        } catch (error) {
            console.error('Error adding payment:', error);
            alert('Failed to add payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Add New ZWG Levy Payment</h2>
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
                <button
                    type="submit"
                    className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Payment'}
                </button>
            </form>
        </div>
    );
};

export default NewLevyZWG;