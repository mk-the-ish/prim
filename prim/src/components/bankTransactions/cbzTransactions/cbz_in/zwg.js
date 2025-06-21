import React, { useState } from 'react';
import supabase from '../../../../db/SupaBaseConfig';
import Button from '../../../ui/button';
import Card from '../../../ui/card';
import Form from '../../../ui/form';

// Simple toast utility
const showToast = (msg, type = 'success') => {
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.className = `fixed z-50 bottom-6 right-6 px-4 py-2 rounded shadow-lg text-white text-sm ${type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2500);
};

const LIzwg = () => {
    const [formData, setFormData] = useState({
        Date: '',
        Description: '',
        From: '',
        Amount: '',
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
            const { error } = await supabase.from('levy_in_txn_zwg').insert([formData]);
            if (error) throw error;
            showToast('Transaction added successfully!', 'success');
            setFormData({ Date: '', Description: '', From: '', Amount: '' });
        } catch (error) {
            showToast('Failed to add transaction. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Add ZWG Levy Revenue" className="max-w-lg mx-auto mt-10">
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
            </Form>
        </Card>
    );
};

export default LIzwg;