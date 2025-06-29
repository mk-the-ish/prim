import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import supabase from '../../../db/SupaBaseConfig';
import { fetchUser } from '../../api/userApi';
import Form from '../../ui/form';
import Loader from '../../ui/loader';
import { useToast } from '../../../contexts/ToastContext';
import { useTheme } from '../../../contexts/ThemeContext';

const NewTuitionUSD = ({ studentId: propStudentId, onSuccess }) => {
    const params = useParams();
    const studentId = propStudentId || params.studentId;
    const [formData, setFormData] = useState({
        StudentID: studentId,
        Date: '',
        Amount: '',
        transaction_type: '',
        reference: '',
        form: '',
    });
    const { addToast } = useToast();
    const { currentTheme } = useTheme();
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
    });
    const transactionTypes = [
        { value: 'cash', label: 'Cash' },
        { value: 'transfer', label: 'Transfer' },
        { value: 'misplaced transfer', label: 'Misplaced Transfer' }
    ];
    const paymentTimelines = [
        { value: 'normal', label: 'Normal' },
        { value: 'prepayment', label: 'Prepayment' },
        { value: 'recovery', label: 'Recovery' }
    ];
    const mutation = useMutation({
        mutationFn: async (paymentRow) => {
            // Fetch daily rate for the date
            const { data: rateData, error: rateError } = await supabase
                .from('DailyRate')
                .select('Rate')
                .eq('Date', paymentRow.Date)
                .maybeSingle();
            if (rateError || !rateData) throw new Error('No daily rate set for this date.');
            const rate = parseFloat(rateData.Rate);
            const amountUSD = parseFloat(paymentRow.Amount);
            const amountZWG = amountUSD * rate;
            // Insert payment into Fees
            const { error: insertError } = await supabase.from('Fees').insert([
                { ...paymentRow, Type: 'Tuition', Currency: 'USD', AmountUSD: amountUSD, AmountZWG: amountZWG, }
            ]);
            if (insertError) throw insertError;
            // Update student's Tuition_Owing (decrease by USD amount)
            const { data: studentData, error: fetchError } = await supabase
                .from('Students')
                .select('Tuition_Owing')
                .eq('id', studentId)
                .single();
            if (fetchError) throw fetchError;
            const newTuitionOwing = (studentData.Tuition_Owing || 0) - amountUSD;
            const { error: updateError } = await supabase
                .from('Students')
                .update({ Tuition_Owing: newTuitionOwing })
                .eq('id', studentId);
            if (updateError) throw updateError;
        },
        onSuccess: () => {
            addToast('USD Tuition payment added successfully!', 'success');
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            addToast(err?.message || 'Failed to process payment. Please try again.', 'error');
        }
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({
            ...formData,
            Type: 'Tuition',
            Currency: 'USD',
            Amount: parseFloat(formData.Amount),
        });
    };
    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader type="card" count={1} />
            </div>
        );
    }
    return (
        <Form onSubmit={handleSubmit} loading={mutation.isLoading} title="New USD Tuition Payment">
            <div className="flex flex-col md:flex-row gap-4">
                <Form.Input
                    label="Date"
                    type="date"
                    name="Date"
                    value={formData.Date}
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
                <Form.Input
                    label="Reference"
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Form.Select
                    label="Transaction Type"
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleInputChange}
                    options={transactionTypes}
                    required
                />
                <Form.Select
                    label="Payment Timeline"
                    name="form"
                    value={formData.form}
                    onChange={handleInputChange}
                    options={paymentTimelines}
                    required
                />
            </div>
        </Form>
    );
};

export default NewTuitionUSD;