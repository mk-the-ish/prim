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
    { header: 'To', accessor: 'To' },
    { header: 'Amount', render: row => `$${Number(row.Amount).toFixed(2)}` },
];

const LOVzwg = () => {
    const { addToast } = useToast();
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        Date: '',
        Description: '',
        Category: '',
        To: '',
        Amount: ''
    });

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['cbz_out_zwg'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('OutgoingBankTransactions')
                .select('*')
                .eq('Bank', 'cbz')
                .eq('Currency', 'zwg')
                .order('Date', { ascending: false });
            if (error) throw error;
            return data || [];
        }
    });

    const categories = [
        'food',
        'cleaning materials',
        'stationery',
        'communication',
        'staff development',
        'affiliations',
        'utilities',
        'fixtures and fittings',
        'repairs',
        'ground maintenance',
        'others',
    ];

    const mutation = useMutation({
        mutationFn: async (form) => {
            const { error } = await supabase.from('OutgoingBankTransactions').insert([
                {
                    Date: form.Date,
                    Description: form.Description,
                    To: form.To,
                    Amount: parseFloat(form.Amount),
                    Category: form.Category,
                    Bank: 'cbz',
                    Currency: 'zwg'
                }
            ]);
            if (error) throw error;
        },
        onSuccess: () => {
            addToast('Transaction added successfully!', 'success');
            setShowModal(false);
            setFormData({ Date: '', Description: '', To: '', Amount: '', Category: '' });
            queryClient.invalidateQueries(['cbz_out_zwg']);
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
                title="ZWG Outgoing Payments"
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
            <FormModal open={showModal} onClose={() => setShowModal(false)} title="Add ZWG Outgoing Payment">
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
                            label="To"
                            type="text"
                            name="To"
                            value={formData.To}
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
                            type="text"
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

export default LOVzwg;
