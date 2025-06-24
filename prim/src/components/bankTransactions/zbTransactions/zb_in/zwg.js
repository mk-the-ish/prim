import React, { useState } from 'react';
import supabase from '../../../../db/SupaBaseConfig';
import { useTheme } from '../../../../contexts/ThemeContext';

const TIzwg = () => {
    const [formData, setFormData] = useState({
        Date: '',
        Description: '',
        From: '',
        Amount: '',
    });
    const [loading, setLoading] = useState(false);
    const { currentTheme } = useTheme();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('tuition_in_txn_zwg').insert([formData]);
            if (error) throw error;

            alert('Transaction added successfully!');
            setFormData({ Date: '', Description: '', From: '', Amount: '' });
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="max-w-lg mx-auto p-6 rounded-lg shadow-md"
            style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}
        >
            <h2 className="text-2xl font-bold text-center mb-6">Add ZWG Tuition Revenue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">Date</label>
                    <input
                        type="date"
                        name="Date"
                        value={formData.Date}
                        onChange={handleInputChange}
                        className="w-full rounded-lg p-2 focus:outline-none focus:ring-2"
                        style={{
                            border: `1px solid ${currentTheme.divider || '#d1d5db'}`,
                            background: currentTheme.background?.default,
                            color: currentTheme.text?.primary
                        }}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">Description</label>
                    <input
                        type="text"
                        name="Description"
                        value={formData.Description}
                        onChange={handleInputChange}
                        className="w-full rounded-lg p-2 focus:outline-none focus:ring-2"
                        style={{
                            border: `1px solid ${currentTheme.divider || '#d1d5db'}`,
                            background: currentTheme.background?.default,
                            color: currentTheme.text?.primary
                        }}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">From</label>
                    <input
                        type="text"
                        name="From"
                        value={formData.From}
                        onChange={handleInputChange}
                        className="w-full rounded-lg p-2 focus:outline-none focus:ring-2"
                        style={{
                            border: `1px solid ${currentTheme.divider || '#d1d5db'}`,
                            background: currentTheme.background?.default,
                            color: currentTheme.text?.primary
                        }}
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
                        className="w-full rounded-lg p-2 focus:outline-none focus:ring-2"
                        style={{
                            border: `1px solid ${currentTheme.divider || '#d1d5db'}`,
                            background: currentTheme.background?.default,
                            color: currentTheme.text?.primary
                        }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                        background: currentTheme.primary?.main || '#2563eb',
                        color: currentTheme.primary?.contrastText || '#fff'
                    }}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    );
};

export default TIzwg;