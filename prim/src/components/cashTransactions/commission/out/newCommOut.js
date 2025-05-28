import React, { useState } from 'react';
import supabase from '../../../SupaBaseConfig';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api'

const NewCommOut = () => {
    const [commission, setCommission] = useState({
        Date: '',
        To: '',
        Amount: '',
        Description: '',
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setCommission({ ...commission, [e.target.name]: e.target.value });
    };

    const { data: userData, isLoading: userLoading } = useQuery({
            queryKey: ['user'],
            queryFn: fetchUser,
            onError: () => navigate('/login')
    });
    
    if (loading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Payment Form...</p>
                </div>
            </div>
        );
    }

    const handleAddCommission = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!commission.Date || !commission.To || !commission.Amount || !commission.Description) {
            console.error('All fields are required.');
            return;
        }

        // Insert data into the Supabase database
        const { error } = await supabase.from('commissions_out').insert([commission]);

        if (error) {
            console.error('Error adding commission:', error);
        } else {
            // Redirect to the CommOUT component after successful submission
            navigate('/commission');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
                    {/* Fixed Header */}
                    <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                        <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                            <FaUserCircle className="text-lg" />
                            <span className="ml-4">{userData?.name || 'Profile'}</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-center flex-1">Add New Commission Out</h1>
                        <Link
                            to={`/commission`}
                            className="text-white hover:text-gray-300 transition-colors duration-200"
                        >
                            Back to Commissions Out
                        </Link>
                    </div>
        
                    {/* Main Content */}
                    <div className="px-6">
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
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
                    <label className="block text-sm font-medium mb-1 text-left">To</label>
                    <input
                        type="text"
                        name="To"
                        placeholder="To"
                        value={commission.To}
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
            </div>
            </div>
    );
};

export default NewCommOut;