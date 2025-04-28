import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../../../SupaBaseConfig';

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
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .eq('Status', 'pending'); // Fetch only pending invoices

            if (error) throw error;

            setInvoices(data || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const handlePay = (id) => {
        console.log(`Pay invoice with ID: ${id}`);
        // Add logic for payment
    };

    const handleEdit = (id) => {
        console.log(`Edit invoice with ID: ${id}`);
        // Add logic for editing
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
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Pending Invoices</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* New Purchases Invoice Card */}
                <div
                    onClick={() => navigate('/levyOUT/payment')}
                    className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 border border-gray-200 cursor-pointer hover:bg-gray-100"
                >
                    <FaPlus className="text-6xl text-gray-400" />
                    <p className="text-lg font-bold mt-4">New Purchases Invoice</p>
                </div>

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
                                <button
                                    onClick={() => handlePay(invoice.id)}
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
        </div>
    
        
    );
};

export default ViewInvoices;