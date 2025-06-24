import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import supabase from '../../../db/SupaBaseConfig';
import { fetchUser } from '../../api/userApi';
import {
    FaUtensils,
    FaBroom,
    FaPencilAlt,
    FaPhone,
    FaChalkboardTeacher,
    FaHandshake,
    FaLightbulb,
    FaCouch,
    FaTools,
    FaTree,
    FaEllipsisH,
    FaPlus,
} from 'react-icons/fa';
import Card from '../../ui/card';

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

const ViewInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [statusFilter, setStatusFilter] = useState('pending');
    const navigate = useNavigate();

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
        fetchInvoices();
    }, [statusFilter]);

    const fetchInvoices = async () => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .eq('Status', statusFilter);

            if (error) throw error;
            setInvoices(data || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const handlePay = async (invoice) => {
        try {
            // Determine target transaction table
            let targetTable = '';
            if (invoice.Account === 'cbz') {
                targetTable = invoice.Currency === 'usd' ? 'levy_out_txn_usd' : 'levy_out_txn_zwg';
            } else {
                targetTable = invoice.Currency === 'usd' ? 'tuition_out_txn_usd' : 'tuition_out_txn_zwg';
            }

            // Create transaction record
            const { error: txnError } = await supabase
                .from(targetTable)
                .insert([{
                    To: invoice.Supplier,
                    Category: invoice.Category,
                    Date: new Date().toISOString(),
                    Amount: invoice.Amount,
                    Description: invoice.Description,
                    Reference: `INV-${invoice.id}`
                }]);
            if (txnError) throw txnError;

            // Update invoice status
            const { error: updateError } = await supabase
                .from('invoices')
                .update({ Status: 'paid' })
                .eq('id', invoice.id);
            if (updateError) throw updateError;

            fetchInvoices();
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Failed to process payment');
        }
    };

    const handleEdit = (id) => {
        navigate(`/update-invoice/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase.from('invoices').delete().eq('id', id);
            if (error) throw error;

            setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
            console.log(`Deleted invoice with ID: ${id}`);
        } catch (error) {
            console.error('Error deleting invoice:', error);
        }
    };

    return (
        <div className="p-6 min-h-screen relative">
            <Card title={'View Invoices'} className="mb-6"
                headerAction={
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                </select>
                }
            >

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">

                {/* Invoice Cards */}
                {invoices.map((invoice) => {
                    const Icon =
                        categoryIcons[invoice.Category?.toLowerCase()] || categoryIcons.others;

                    return (
                        <div
                            key={invoice.id}
                            className="flex flex-col bg-white shadow-lg rounded-lg p-6 border border-gray-200"
                        >
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <Icon className="text-4xl text-gray-500" />
                            </div>

                            {/* Invoice Details */}
                            <div className="flex flex-col gap-2">
                                <p className="text-lg font-bold">{invoice.Supplier}</p>
                                <p className="text-sm text-gray-600">{invoice.Description}</p>
                                <p className="text-sm font-semibold">
                                    Amount: ${invoice.Amount.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">Account: {invoice.Account}</p>
                                <p className="text-sm text-gray-600">Currency: {invoice.Currency}</p>
                                <p className="text-sm text-gray-600">Category: {invoice.Category}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between mt-4">
                                {statusFilter === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handlePay(invoice)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            Pay
                                        </button>
                                        <button
                                            onClick={() => handleEdit(invoice.id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => handleDelete(invoice.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Action Button - only visible for admin/bursar */}
            {['admin', 'bursar'].includes(userData?.role) && (
                <button
                    onClick={() => navigate('/create-invoice')}
                    className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                    <FaPlus className="text-2xl" />
                </button>
            )}
            </Card>
        </div>
    );
};

export default ViewInvoices;