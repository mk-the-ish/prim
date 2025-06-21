import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import supabase from '../../../db/SupaBaseConfig';
import { fetchUser } from '../../api/userApi';
import TopBar from '../../ui/topbar';
import Form from '../../ui/form';
import Loader from '../../ui/loader';
import { useToast } from '../../../contexts/ToastContext';
import { useTheme } from '../../../contexts/ThemeContext';

const NewTuitionZWG = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        StudentID: studentId,
        Date: '',
        form: '',
        Amount: '',
        USD_equivalent: '',
        reference: '',
    });
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const { currentTheme } = useTheme();

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login')
    });

    const paymentTimelines = [
        { value: 'normal', label: 'Normal' },
        { value: 'prepayment', label: 'Prepayment' },
        { value: 'recovery', label: 'Recovery' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Insert payment into Fees table
            const paymentRow = {
                ...formData,
                Type: 'Tuition',
                Currency: 'ZWG',
                Amount: parseFloat(formData.Amount),
                USD_equivalent: parseFloat(formData.USD_equivalent),
            };
            const { error: insertError } = await supabase.from('Fees').insert([paymentRow]);
            if (insertError) throw insertError;

            // Update student's Tuition_Owing
            const { data: studentData, error: fetchError } = await supabase
                .from('Students')
                .select('Tuition_Owing')
                .eq('id', studentId)
                .single();
            if (fetchError) throw fetchError;

            const newTuitionOwing = (studentData.Tuition_Owing || 0) - parseFloat(formData.USD_equivalent);

            const { error: updateError } = await supabase
                .from('Students')
                .update({ Tuition_Owing: newTuitionOwing })
                .eq('id', studentId);
            if (updateError) throw updateError;

            addToast('ZWG Tuition payment added successfully!', 'success');
            navigate(`/student-view/${studentId}`);
        } catch (error) {
            addToast('Failed to process payment. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading || userLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: currentTheme.background?.default }}
            >
                <Loader type="card" count={1} />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen"
            style={{ background: currentTheme.background?.default }}
        >
            <TopBar title="New ZWG Tuition Payment" userName={userData?.name} />
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
                    <Form.Select
                        label="Payment Timeline"
                        name="form"
                        value={formData.form}
                        onChange={handleInputChange}
                        options={paymentTimelines}
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
                        label="USD Equivalent"
                        type="number"
                        name="USD_equivalent"
                        value={formData.USD_equivalent}
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
                </Form>
            </div>
        </div>
    );
};

export default NewTuitionZWG;