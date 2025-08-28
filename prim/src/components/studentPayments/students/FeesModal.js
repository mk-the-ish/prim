import React, { useState, useEffect } from 'react';
import Modal from '../../ui/modal';
import Form from '../../ui/form';
import supabase from '../../../db/SupaBaseConfig';

const FeesModal = ({ open, onClose, studentId, onSubmit }) => {
    const [form, setForm] = useState({
        AmountUSD: '',
        AmountZWG: '',
        Type: 'levy',
        PaymentTimeline: 'normal',
        Form: 'cash',
        Date: '',
        Currency: 'usd',
        Reference: '',
        receipt_number: '',
        Account: ''
    });
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        if (open) {
            setForm({
                AmountUSD: '',
                AmountZWG: '',
                Type: 'levy',
                PaymentTimeline: 'normal',
                Form: 'cash',
                Date: '',
                Currency: 'usd',
                Reference: '',
                receipt_number: '',
                Account: ''
            });
            // Fetch accounts for dropdown
            supabase
                .from('Accounts')
                .select('id, Bank, Branch, AccNumber, Currency')
                .then(({ data }) => setAccounts(data || []));
        }
    }, [open]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit({ ...form, StudentID: studentId });
        onClose();
    };

    if (!open) return null;
    return (
        <Modal open={open} onClose={onClose}>
            <Form onSubmit={handleSubmit} title="Add Fee Payment">
                <div className="flex flex-col md:flex-row gap-4">
                    <Form.Input
                        label="Amount USD"
                        type="number"
                        name="AmountUSD"
                        value={form.AmountUSD}
                        onChange={handleChange}
                        required
                    />
                    <Form.Input
                        label="Amount ZWG"
                        type="number"
                        name="AmountZWG"
                        value={form.AmountZWG}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <Form.Select
                        label="Type"
                        name="Type"
                        value={form.Type}
                        onChange={handleChange}
                        options={[
                            { value: 'levy', label: 'Levy' },
                            { value: 'tuition', label: 'Tuition' },
                            { value: 'exam fee', label: 'Exam Fee' },
                            { value: 'special levy', label: 'Special Levy' },
                            { value: 'other', label: 'Other' }
                        ]}
                    />
                    <Form.Select
                        label="Payment Timeline"
                        name="PaymentTimeline"
                        value={form.PaymentTimeline}
                        onChange={handleChange}
                        options={[
                            { value: 'normal', label: 'Normal' },
                            { value: 'late', label: 'Late' },
                            { value: 'prepayment', label: 'Prepayment' }
                        ]}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <Form.Select
                        label="Form"
                        name="Form"
                        value={form.Form}
                        onChange={handleChange}
                        options={[
                            { value: 'cash', label: 'Cash' },
                            { value: 'transfer', label: 'Transfer' },
                            { value: 'ecocash', label: 'EcoCash' }
                        ]}
                    />
                    <Form.Select
                        label="Currency"
                        name="Currency"
                        value={form.Currency}
                        onChange={handleChange}
                        options={[
                            { value: 'usd', label: 'USD' },
                            { value: 'zwg', label: 'ZWG' }
                        ]}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <Form.Input
                        label="Date"
                        type="date"
                        name="Date"
                        value={form.Date}
                        onChange={handleChange}
                        required
                    />
                    <Form.Input
                        label="Reference"
                        type="text"
                        name="Reference"
                        value={form.Reference}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <Form.Select
                        label="Account"
                        name="Account"
                        value={form.Account}
                        onChange={handleChange}
                        options={[
                            { value: '', label: 'Select Account' },
                            ...accounts.map(acc => ({
                                value: acc.id,
                                label: `${acc.Bank} - ${acc.Branch} - ${acc.AccNumber} (${acc.Currency})`
                            }))
                        ]}
                        required
                    />
                </div>
                <div className="mt-4">
                    <Form.Input
                        label="Receipt Number"
                        type="text"
                        name="receipt_number"
                        value={form.receipt_number}
                        onChange={handleChange}
                    />
                </div>
            </Form>
        </Modal>
    );
};

export default FeesModal;