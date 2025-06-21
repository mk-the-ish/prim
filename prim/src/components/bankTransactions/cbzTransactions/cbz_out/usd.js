import React, { useState } from 'react';
import supabase from '../../../../db/SupaBaseConfig';
import Form from '../../../ui/form';
import TopBar from '../../../ui/topbar';
import Button from '../../../ui/button';
import SkeletonLoader from '../../../ui/loader';

const LOusd = () => {
    const [formData, setFormData] = useState({
        Date: '',
        Description: '',
        To: '',
        Amount: '',
        Category: 'levy', // Added field
        Bank: 'CBZ',     // Added field
        Currency: 'USD'  // Added field
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('OutgoingBankTransactions')
                .insert([formData]);
            if (error) throw error;

            alert('Transaction added successfully!');
            setFormData({
                Date: '',
                Description: '',
                To: '',
                Amount: '',
                Category: 'levy',
                Bank: 'CBZ',
                Currency: 'USD'
            });
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <SkeletonLoader type="card" className="w-1/3" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <TopBar title="Add USD Levy Payment" />
            <div className="px-6">
                <Form onSubmit={handleSubmit} loading={loading}>
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
                </Form>
            </div>
        </div>
    );
};

export default LOusd;