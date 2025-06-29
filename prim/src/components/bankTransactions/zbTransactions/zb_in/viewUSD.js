import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../../../../db/SupaBaseConfig';
import Card from '../../../ui/card';
import SkeletonLoader from '../../../ui/loader';
import DataTable from '../../../ui/dataTable';
import { useToast } from '../../../../contexts/ToastContext';
import Button from '../../../ui/button';
import FormModal from '../../../ui/FormModal';
import Form from '../../../ui/form';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Created At', render: row => new Date(row.created_at).toLocaleString() },
    { header: 'Category', accessor: 'Category' },
    { header: 'Description', accessor: 'Description' },
    { header: 'From', accessor: 'From' },
    { header: 'Amount', render: row => `$${Number(row.Amount).toFixed(2)}` },
];

const categories = [
    'fees',
    'donations',
    'grants',
    'interest',
    'other',
];

const TIVusd = () => {
    const { addToast } = useToast();
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        Date: '',
        Description: '',
        Category: '',
        From: '',
        Amount: ''
    });

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['zb_in_usd'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('IncomingBankTransactions')
                .select('*')
                .eq('Bank', 'zb')
                .eq('Currency', 'usd')
                .order('Date', { ascending: false });
            if (error) throw error;
            return data || [];
        }
    });

    const mutation = useMutation({
        mutationFn: async (form) => {
            const { error } = await supabase.from('IncomingBankTransactions').insert([
                {
                    Date: form.Date,
                    Description: form.Description,
                    Category: form.Category,
                    From: form.From,
                    Amount: parseFloat(form.Amount),
                    Bank: 'zb',
                    Currency: 'usd'
                }
            ]);
            if (error) throw error;
        },
        onSuccess: () => {
            addToast('Transaction added successfully!', 'success');
            setShowModal(false);
            setFormData({ Date: '', Description: '', Category: '', From: '', Amount: '' });
            queryClient.invalidateQueries(['zb_in_usd']);
        },
        onError: () => {
            addToast('Failed to add transaction. Please try again.', 'error');
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="p-0">
            <Card
                title="USD Incoming Payments"
                headerAction={<Button variant="secondary" size="sm" onClick={() => setShowModal(true)}>Add Payment</Button>}
            >
                {isLoading ? (
                    <SkeletonLoader type="card" count={1} />
                ) : (
                    <DataTable
                        columns={columns}
                        data={transactions}
                        currentPage={1}
                        totalPages={1}
                        itemsPerPage={transactions.length}
                        onPageChange={() => { }}
                    />
                )}
            </Card>
            <FormModal open={showModal} onClose={() => setShowModal(false)} title="Add USD Incoming Payment">
                <Form onSubmit={handleSubmit} loading={mutation.isLoading}>
                    <div className="flex flex-col md:flex-row gap-5">
                        <Form.Input
                            label="Date"
                            type="date"
                            name="Date"
                            value={formData.Date}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="Description"
                            type="text"
                            name="Description"
                            value={formData.Description}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="From"
                            type="text"
                            name="From"
                            value={formData.From}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="Amount"
                            type="number"
                            name="Amount"
                            value={formData.Amount}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Select
                            label="Category"
                            name="Category"
                            value={formData.Category}
                            onChange={handleInputChange}
                            options={categories}
                            required
                        />
                    </div>
                </Form>
            </FormModal>
        </div>
    );
};

export default TIVusd;