import React, { useState } from 'react';
import supabase from '../../SupaBaseConfig';
import { useNavigate } from 'react-router-dom';

const NewCommIN = () => {
    const [commission, setCommission] = useState({
        Date: '',
        From: '',
        Amount: '',
        Description: '',
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setCommission({ ...commission, [e.target.name]: e.target.value });
    };

    const handleAddCommission = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('commissions_in').insert([commission]);

        if (error) {
            console.error('Error adding commission:', error);
        } else {
            navigate('/commIN'); // Redirect to commIN after successful submission
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Add New Commission In</h2>
            <form onSubmit={handleAddCommission} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">Date</label>
                    <input
                        type="date"
                        name="Date"
                        value={commission.Date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">From</label>
                    <input
                        type="text"
                        name="From"
                        placeholder="From"
                        value={commission.From}
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
                        placeholder="Amount"
                        value={commission.Amount}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-left">Description</label>
                    <textarea
                        name="Description"
                        placeholder="Description"
                        value={commission.Description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Add Commission
                </button>
            </form>
        </div>
    );
};

export default NewCommIN;