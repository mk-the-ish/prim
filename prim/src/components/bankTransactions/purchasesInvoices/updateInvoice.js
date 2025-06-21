import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import supabase from '../../../db/SupaBaseConfig';
import { fetchUser } from '../../api/userApi';
import {
    FaUtensils, FaBroom, FaPencilAlt, FaPhone, FaChalkboardTeacher,
    FaHandshake, FaLightbulb, FaCouch, FaTools, FaTree, FaEllipsisH,
} from 'react-icons/fa';

const categoryIcons = {
    food: FaUtensils,
    'cleaning materials': FaBroom,
    stationery: FaPencilAlt,
    communication: FaPhone,
    'staff development': FaChalkboardTeacher,
    affiliations: FaHandshake,
    utilities: FaLightbulb,
    'fixtures and fittings': FaCouch,
    repairs: FaTools,
    'ground maintenance': FaTree,
    others: FaEllipsisH,
};

const UpdateInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Supplier: '',
        Description: '',
        Amount: '',
        Account: '',
        Currency: '',
        Category: '',
    });
    const [loading, setLoading] = useState(true);

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => fetchUser(['admin', 'bursar']),
        retry: false,
        onError: (error) => {
            if (error.message.includes('Not authenticated')) {
                navigate('/login');
            } else if (error.message.includes('Unauthorized')) {
                navigate('/unauthorised');
            }
        }
    });

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData(data);
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
            alert('Failed to fetch invoice details');
            navigate('/transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('invoices')
                .update(formData)
                .eq('id', id);

            if (error) throw error;
            navigate('/transactions');
            alert('Invoice updated successfully');
        } catch (error) {
            console.error('Error updating invoice:', error);
            alert('Failed to update invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add loading check
    if (userLoading) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <Link to="/profile" className="flex items-center">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userData?.name}</span>
                </Link>
                <h1 className="text-2xl font-bold">Update Invoice</h1>
                <Link to="/transactions" className="text-white hover:text-gray-300">
                    Back to Invoices
                </Link>
            </div>

            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Supplier</label>
                        <input
                            type="text"
                            name="Supplier"
                            value={formData.Supplier}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            name="Amount"
                            value={formData.Amount}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Account</label>
                        <select
                            name="Account"
                            value={formData.Account}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Account</option>
                            <option value="zb">ZB</option>
                            <option value="cbz">CBZ</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Currency</label>
                        <select
                            name="Currency"
                            value={formData.Currency}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Currency</option>
                            <option value="usd">USD</option>
                            <option value="zwg">ZWG</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="Category"
                            value={formData.Category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Category</option>
                            {Object.keys(categoryIcons).map(category => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Invoice'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/transactions')}
                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateInvoice;
