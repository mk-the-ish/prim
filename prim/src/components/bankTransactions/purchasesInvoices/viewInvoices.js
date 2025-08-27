import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../../../db/SupaBaseConfig';
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
} from 'react-icons/fa';
import Card from '../../ui/card';
import Modal from '../../ui/modal';
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
    Category: '',
    Item: '',
    description: '',
    quantity: '',
    Status: 'pending',
};

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'partially paid', label: 'Partially Paid' },
];

const ViewInvoices = () => {
    const [statusFilter, setStatusFilter] = useState('pending');
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formState, setFormState] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [payFormState, setPayFormState] = useState({
        AmountDue: '',
        AmountPaid: '',
        Description: '',
        VendorId: '',
        Account: '',
        Date: new Date().toISOString().slice(0, 10),
    });
    const [vendors, setVendors] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const toast = useToast();

    // Fetch invoices
    const { data: invoices = [] } = useQuery({
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

    // Form handlers
    const openCreateModal = () => {
        setFormState(initialFormState);
        setEditMode(false);
        setEditingId(null);
        setModalOpen(true);
    };
    const openEditModal = (invoice) => {
        setFormState({
            Category: invoice.Category,
            Item: invoice.Item,
            description: invoice.description,
            quantity: invoice.quantity,
            Status: invoice.Status,
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
            createInvoiceMutation.mutate({ ...formState });
        }
    };

    // Fetch vendors and accounts when pay modal opens
    useEffect(() => {
        if (payModalOpen && selectedInvoice) {
            // Fetch vendors for invoice category
            supabase
                .from('Vendors')
                .select('id, Name, Category')
                .eq('Category', selectedInvoice.Category)
                .then(({ data }) => setVendors(data || []));
            // Fetch all accounts
            supabase
                .from('Accounts')
                .select('id, Bank, Branch, AccNumber, Currency')
                .then(({ data }) => setAccounts(data || []));
        }
    }, [payModalOpen, selectedInvoice]);

    const openPayModal = (invoice) => {
        setSelectedInvoice(invoice);
        setPayFormState({
            AmountDue: '',
            AmountPaid: '',
            Description: '',
            VendorId: '',
            Account: '',
            Date: new Date().toISOString().slice(0, 10),
        });
        setPayModalOpen(true);
    };

    const handlePayFormChange = (e) => {
        const { name, value } = e.target;
        setPayFormState((prev) => ({ ...prev, [name]: value }));
    };

    const { addToast } = useToast();

    const handlePayInvoice = async (e) => {
        e.preventDefault();
        if (!selectedInvoice) return;
        try {
            const amountDue = parseFloat(payFormState.AmountDue);
            const amountPaid = parseFloat(payFormState.AmountPaid);

            // Validation: AmountPaid should not exceed AmountDue
            if (amountPaid > amountDue) {
                addToast('Amount Paid cannot be greater than Amount Due.', 'error');
                return;
            }

            // Determine new status
            let newStatus = 'pending';
            if (amountPaid === amountDue) {
                newStatus = 'paid';
            } else if (amountPaid < amountDue && amountPaid > 0) {
                newStatus = 'partially paid';
            }

            // Insert into Creditors
            const { data: creditorData, error: creditorError } = await supabase
                .from('Creditors')
                .insert([{
                    InvoiceId: selectedInvoice.id,
                    VendorId: payFormState.VendorId,
                    AmountDue: amountDue,
                    AmountPaid: amountPaid,
                    Description: payFormState.Description,
                    Account: payFormState.Account,
                }])
                .select('id')
                .single();
            if (creditorError) throw creditorError;

            // Get vendor name for OutgoingBankTransactions
            const vendor = vendors.find(v => v.id === payFormState.VendorId);

            // Insert into OutgoingBankTransactions
            const { error: outgoingError } = await supabase
                .from('OutgoingBankTransactions')
                .insert([{
                    Date: payFormState.Date,
                    Description: payFormState.Description,
                    To: vendor?.Name || '',
                    Amount: amountPaid,
                    Category: selectedInvoice.Category,
                    Account: payFormState.Account,
                    CredId: creditorData.id,
                }]);
            if (outgoingError) throw outgoingError;

            // Update invoice status
            const { error: invoiceError } = await supabase
                .from('Invoices')
                .update({ Status: newStatus })
                .eq('id', selectedInvoice.id);
            if (invoiceError) throw invoiceError;

            addToast('Payment recorded successfully', 'success');
            setPayModalOpen(false);
            setSelectedInvoice(null);
            setPayFormState({
                AmountDue: '',
                AmountPaid: '',
                Description: '',
                VendorId: '',
                Account: '',
                Date: new Date().toISOString().slice(0, 10),
            });
            queryClient.invalidateQueries(['invoices']);
        } catch (err) {
            addToast('Failed to record payment', 'error');
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
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
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
                                    <p className="text-lg font-bold">{invoice.Item}</p>
                                    <p className="text-sm text-gray-600">{invoice.description}</p>
                                    <p className="text-sm text-gray-600">
                                        Quantity: {invoice.quantity}
                                    </p>
                                    <p className="text-sm text-gray-600">Category: {invoice.Category}</p>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => openEditModal(invoice)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                                    >
                                        <FaEdit /> 
                                    </button>
                                    <button
                                        onClick={() => openPayModal(invoice)}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                                    >
                                        <FaPlus />
                                    </button>
                                    <button
                                        onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                                        disabled={deleteInvoiceMutation.isLoading}
                                    >
                                        <FaTrash />
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
                        <Select
                            label="Category"
                            name="Category"
                            value={formState.Category}
                            onChange={handleFormChange}
                            required
                            options={[
                                { value: '', label: 'Select Category' },
                                ...Object.keys(categoryIcons).map((cat) => ({
                                    value: cat,
                                    label: cat.charAt(0).toUpperCase() + cat.slice(1)
                                }))
                            ]}
                        />
                        <Input
                            label="Item"
                            name="Item"
                            value={formState.Item}
                            onChange={handleFormChange}
                            required
                        />
                        <Input
                            label="Description"
                            name="description"
                            value={formState.description}
                            onChange={handleFormChange}
                            required
                        />
                        <Input
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={formState.quantity}
                            onChange={handleFormChange}
                            required
                        />
                        <Select
                            label="Status"
                            name="Status"
                            value={formState.Status}
                            onChange={handleFormChange}
                            required
                            options={statusOptions}
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
                {/* Modal for Pay Invoice */}
                <Modal open={payModalOpen} onClose={() => setPayModalOpen(false)}>
                    <form onSubmit={handlePayInvoice} className="space-y-4 w-80 mx-auto">
                        <h2 className="text-xl font-bold mb-2">Pay Invoice</h2>
                        <Input
                            label="Amount Due"
                            name="AmountDue"
                            type="number"
                            value={payFormState.AmountDue}
                            onChange={handlePayFormChange}
                            required
                        />
                        <Input
                            label="Amount Paid"
                            name="AmountPaid"
                            type="number"
                            value={payFormState.AmountPaid}
                            onChange={handlePayFormChange}
                            required
                        />
                        <Input
                            label="Description"
                            name="Description"
                            value={payFormState.Description}
                            onChange={handlePayFormChange}
                            required
                        />
                        <Select
                            label="Vendor"
                            name="VendorId"
                            value={payFormState.VendorId}
                            onChange={handlePayFormChange}
                            required
                            options={[
                                { value: '', label: 'Select Vendor' },
                                ...vendors.map(v => ({
                                    value: v.id,
                                    label: v.Name
                                }))
                            ]}
                        />
                        <Select
                            label="Account"
                            name="Account"
                            value={payFormState.Account}
                            onChange={handlePayFormChange}
                            required
                            options={[
                                { value: '', label: 'Select Account' },
                                ...accounts.map(a => ({
                                    value: a.id,
                                    label: `${a.Bank} - ${a.Branch} - ${a.AccNumber} (${a.Currency})`
                                }))
                            ]}
                        />
                        <Input
                            label="Date"
                            name="Date"
                            type="date"
                            value={payFormState.Date}
                            onChange={handlePayFormChange}
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setPayModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                            >
                                Pay
                            </button>
                        </div>
                    </form>
                </Modal>
                {/* Floating Action Button */}
                <button
                    onClick={openCreateModal}
                    className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                    <FaPlus className="text-2xl" />
                </button>
            </Card>
        </div>
    );
};

export default ViewInvoices;