import React, { useState, useEffect } from 'react';
import Modal from '../../ui/modal';
import Form from '../../ui/form';
import Loader from '../../ui/loader';
import supabase from '../../../db/SupaBaseConfig';

const FeesModal = ({ open, onClose, studentId, onSubmit }) => {
    const [accounts, setAccounts] = useState([]);
    const [billingTypes, setBillingTypes] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        currency: 'USD',
        paymentForm: '',
        receiptNumber: '',
        accountId: '',
        feesType: '',
    });
    const [loading, setLoading] = useState(false);

    // Fetch accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            const { data, error } = await supabase.from('Accounts').select('*');
            if (!error) setAccounts(data);
        };
        fetchAccounts();
    }, []);

    // Fetch active billing types
    useEffect(() => {
        const fetchBilling = async () => {
            const { data, error } = await supabase
                .from('Billing')
                .select('*')
                .eq('active', true);
            if (!error) setBillingTypes(data);
        };
        fetchBilling();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Insert fee payment
        const feePayload = {
            studentId,
            amount: parseFloat(formData.amount),
            currency: formData.currency,
            paymentForm: formData.paymentForm,
            receiptNumber: formData.receiptNumber,
            accountId: parseInt(formData.accountId),
            feesType: parseInt(formData.feesType),
        };
        const { error } = await supabase.from('Fees').insert([feePayload]);
        if (error) {
            setLoading(false);
            alert('Error recording payment');
            return;
        }

        // Fetch billing type to determine which owing field to update
        const billing = billingTypes.find(b => b.id === parseInt(formData.feesType));
        let owingField = 'otherOwing';
        if (billing?.type?.toLowerCase().includes('levy')) owingField = 'levyOwing';
        else if (billing?.type?.toLowerCase().includes('tuition')) owingField = 'tuitionOwing';

        // Update student's owing field
        const { data: studentData, error: studentError } = await supabase
            .from('Students')
            .select(owingField)
            .eq('id', studentId)
            .single();

        if (!studentError && studentData) {
            const newOwing = Math.max(0, (studentData[owingField] || 0) - parseFloat(formData.amount));
            await supabase
                .from('Students')
                .update({ [owingField]: newOwing })
                .eq('id', studentId);
        }

        setLoading(false);
        onSubmit && onSubmit(feePayload);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            {loading ? (
                <Loader type="card" count={1} />
            ) : (
                <Form onSubmit={handleSubmit} title="Record Fee Payment">
                    <Form.Input
                        label="Amount"
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                    <Form.Select
                        label="Currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        required
                        options={[
                            { value: 'USD', label: 'USD' },
                            { value: 'ZWL', label: 'ZWL' },
                        ]}
                    />
                    <Form.Input
                        label="Payment Form"
                        type="text"
                        name="paymentForm"
                        value={formData.paymentForm}
                        onChange={handleChange}
                        required
                    />
                    <Form.Input
                        label="Receipt Number"
                        type="text"
                        name="receiptNumber"
                        value={formData.receiptNumber}
                        onChange={handleChange}
                    />
                    <Form.Select
                        label="Account"
                        name="accountId"
                        value={formData.accountId}
                        onChange={handleChange}
                        required
                        options={accounts.map(acc => ({
                            value: acc.id,
                            label: `${acc.bank} - ${acc.accNumber} (${acc.currency})`
                        }))}
                    />
                    <Form.Select
                        label="Fees Type"
                        name="feesType"
                        value={formData.feesType}
                        onChange={handleChange}
                        required
                        options={billingTypes.map(bill => ({
                            value: bill.id,
                            label: `${bill.type} (${bill.amount})`
                        }))}
                    />
                </Form>
            )}
        </Modal>
    );
};

export default FeesModal;