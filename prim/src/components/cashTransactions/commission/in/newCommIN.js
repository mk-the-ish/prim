import React, { useState } from 'react';
import supabase from '../../../SupaBaseConfig';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchUser } from '../../api';
import { FaUserCircle } from 'react-icons/fa';

const NewCommIN = () => {
    const [commission, setCommission] = useState({
        Date: '',
        From: '',
        Amount: '',
        Description: '',
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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


    const handleInputChange = (e) => {
        setCommission({ ...commission, [e.target.name]: e.target.value });
    };

    const handleAddCommission = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('commissions_in').insert([commission]);

        if (error) {
            console.error('Error adding commission:', error);
        } else {
            navigate('/commissions'); // Redirect to commIN after successful submission
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
                                <h1 className="text-2xl font-bold text-center flex-1">Add New Commission In</h1>
                                <Link
                                    to={`/commission`}
                                    className="text-white hover:text-gray-300 transition-colors duration-200"
                                >
                                    Back to Commissions In
                                </Link>
                            </div>
                
                            {/* Main Content */}
                            <div className="px-6"></div>
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
            </div>
    );
};

export default NewCommIN;