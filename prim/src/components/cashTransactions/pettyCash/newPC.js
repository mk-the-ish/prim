import React, { useState } from 'react';
import supabase from '../../../db/SupaBaseConfig';

const NewPC = () => {
    const [formData, setFormData] = useState({
        date: '',
        Receipient: '',
        Description: '',
        Category: '',
        amount: '',
    });
    const [loading, setLoading] = useState(false);

    const categories = [
        'Transport and Subsistence',
        'Staff Provisions',
        'Sports',
        'Repairs and Maintenance',
        'Airtime',
        'Others'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('pettyCash').insert([formData]);
            if (error) throw error;
            alert('Transaction added successfully!');
            setFormData({ date: '', Receipient: '', Description: '', Category: '', amount: '' });
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">New Petty Cash Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Recipient</label>
                    <input
                        type="text"
                        value={formData.Receipient}
                        onChange={(e) => setFormData({...formData, Receipient: e.target.value})}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                        type="text"
                        value={formData.Description}
                        onChange={(e) => setFormData({...formData, Description: e.target.value})}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        value={formData.Category}
                        onChange={(e) => setFormData({...formData, Category: e.target.value})}
                        className="w-full border rounded p-2"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    {loading ? 'Adding...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    );
};

export default NewPC;
