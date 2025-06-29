import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    FaEdit,
    FaTrash,
    FaMoneyCheckAlt,
} from 'react-icons/fa';
import Card from '../../ui/card';
import Modal from '../../ui/modal';
import Form from '../../ui/form';
import Input from '../../ui/input';
import Select from '../../ui/select';
import { useToast } from '../../../contexts/ToastContext';

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

const initialFormState = {
    Supplier: '',
    Description: '',
    Amount: '',
    Account: '',
    Currency: '',
    Category: '',
};

const ViewInvoices = () => {
    const [statusFilter, setStatusFilter] = useState('pending');
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formState, setFormState] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const toast = useToast();

    // Fetch user
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

    // Fetch invoices
    const { data: invoices = [], refetch } = useQuery({
        queryKey: ['invoices', statusFilter],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('Invoices')
                .select('*')
                .eq('Status', statusFilter);
            if (error) throw error;
            return data || [];
        },
    });

    // Create invoice mutation
    const createInvoiceMutation = useMutation({
        mutationFn: async (newInvoice) => {
            const { error } = await supabase.from('Invoices').insert([newInvoice]);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Invoice created');
            setModalOpen(false);
            setFormState(initialFormState);
            queryClient.invalidateQueries(['invoices']);
        },
        onError: () => toast.error('Failed to create invoice'),
    });

    // Update invoice mutation
    const updateInvoiceMutation = useMutation({
        mutationFn: async ({ id, ...update }) => {
            const { error } = await supabase.from('Invoices').update(update).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Invoice updated');
            setModalOpen(false);
            setFormState(initialFormState);
            setEditingId(null);
            setEditMode(false);
            queryClient.invalidateQueries(['invoices']);
        },
        onError: () => toast.error('Failed to update invoice'),
    });

    // Delete invoice mutation
    const deleteInvoiceMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase.from('Invoices').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Invoice deleted');
            queryClient.invalidateQueries(['invoices']);
        },
        onError: () => toast.error('Failed to delete invoice'),
    });

    // Pay invoice mutation
    const payInvoiceMutation = useMutation({
        mutationFn: async (invoice) => {
            // Insert into OutgoingBankTransactions
            const { error: txnError } = await supabase
                .from('OutgoingBankTransactions')
                .insert([{
                    To: invoice.Supplier,
                    Category: invoice.Category,
                    Date: new Date().toISOString(),
                    Amount: invoice.Amount,
                    Description: invoice.Description,
                    Reference: `INV-${invoice.id}`,
                    Account: invoice.Account,
                    Currency: invoice.Currency,
                }]);
            if (txnError) throw txnError;
            // Update invoice status
            const { error: updateError } = await supabase
                .from('Invoices')
                .update({ Status: 'paid' })
                .eq('id', invoice.id);
            if (updateError) throw updateError;
        },
        onSuccess: () => {
            toast.success('Payment processed');
            queryClient.invalidateQueries(['invoices']);
        },
        onError: () => toast.error('Failed to process payment'),
    });

    // Form handlers
    const openCreateModal = () => {
        setFormState(initialFormState);
        setEditMode(false);
        setEditingId(null);
        setModalOpen(true);
    };
    const openEditModal = (invoice) => {
        setFormState({
            Supplier: invoice.Supplier,
            Description: invoice.Description,
            Amount: invoice.Amount,
            Account: invoice.Account,
            Currency: invoice.Currency,
            Category: invoice.Category,
        });
        setEditMode(true);
        setEditingId(invoice.id);
        setModalOpen(true);
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            updateInvoiceMutation.mutate({ id: editingId, ...formState });
        } else {
            createInvoiceMutation.mutate({ ...formState, Status: 'pending' });
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
                                    Amount: ${Number(invoice.Amount).toFixed(2)}
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
                                            onClick={() => payInvoiceMutation.mutate(invoice)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                                            disabled={payInvoiceMutation.isLoading}
                                        >
                                            <FaMoneyCheckAlt /> Pay
                                        </button>
                                        <button
                                            onClick={() => openEditModal(invoice)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                                    disabled={deleteInvoiceMutation.isLoading}
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Modal for Create/Edit Invoice */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={handleFormSubmit} className="space-y-4 w-80 mx-auto">
                    <h2 className="text-xl font-bold mb-2">{editMode ? 'Edit Invoice' : 'Create Invoice'}</h2>
                    <Input
                        label="Supplier"
                        name="Supplier"
                        value={formState.Supplier}
                        onChange={handleFormChange}
                        required
                    />
                    <Input
                        label="Description"
                        name="Description"
                        value={formState.Description}
                        onChange={handleFormChange}
                        required
                    />
                    <Input
                        label="Amount"
                        name="Amount"
                        type="number"
                        value={formState.Amount}
                        onChange={handleFormChange}
                        required
                    />
                    <Select
                        label="Account"
                        name="Account"
                        value={formState.Account}
                        onChange={handleFormChange}
                        required
                        options={[
                            { value: '', label: 'Select Account' },
                            { value: 'cbz', label: 'CBZ' },
                            { value: 'zb', label: 'ZB' },
                        ]}
                    />
                    <Select
                        label="Currency"
                        name="Currency"
                        value={formState.Currency}
                        onChange={handleFormChange}
                        required
                        options={[
                            { value: '', label: 'Select Currency' },
                            { value: 'usd', label: 'USD' },
                            { value: 'zwg', label: 'ZWG' },
                        ]}
                    />
                    <Select
                        label="Category"
                        name="Category"
                        value={formState.Category}
                        onChange={handleFormChange}
                        required
                        options={[
                            { value: '', label: 'Select Category' },
                            ...Object.keys(categoryIcons).map((cat) => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))
                        ]}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                            disabled={createInvoiceMutation.isLoading || updateInvoiceMutation.isLoading}
                        >
                            {editMode ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Floating Action Button - only visible for admin/bursar */}
            {['admin', 'bursar'].includes(userData?.role) && (
                <button
                    onClick={openCreateModal}
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