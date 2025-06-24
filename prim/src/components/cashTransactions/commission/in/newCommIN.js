import React, { useState } from 'react';
import supabase from '../../../SupaBaseConfig';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import TopBar from '../../../../components/ui/topbar';
import Loader from '../../../../components/ui/loader';
import Form from '../../../../components/ui/form';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useToast } from '../../../../contexts/ToastContext';

const NewCommIN = () => {
    const [commission, setCommission] = useState({
        Date: '',
        Payee: '',
        Amount: '',
        Description: '',
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login')
    });

    if (loading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background?.default }}>
                <Loader type="card" count={1} />
            </div>
        );
    }

    const handleInputChange = (e) => {
        setCommission({ ...commission, [e.target.name]: e.target.value });
    };

    const handleAddCommission = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('Commissions').insert([commission]);
            if (error) throw error;
            addToast('Commission In added successfully!', 'success');
            navigate('/commission');
        } catch (error) {
            addToast('Error adding commission.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: currentTheme.background?.default }}>
            <TopBar title="Add New Commission In" userName={userData?.name} />
            <div className="max-w-3xl mx-auto mt-10 p-6 rounded-lg shadow-md" style={{ background: currentTheme.background?.paper }}>
                <Form onSubmit={handleAddCommission} loading={loading}>
                    <Form.Input
                        label="Date"
                        type="date"
                        name="Date"
                        value={commission.Date}
                        onChange={handleInputChange}
                        required
                    />
                    <Form.Input
                        label="Payee"
                        type="text"
                        name="Payee"
                        placeholder="Payee"
                        value={commission.Payee}
                        onChange={handleInputChange}
                        required
                    />
                    <Form.Input
                        label="Amount"
                        type="number"
                        name="Amount"
                        placeholder="Amount"
                        value={commission.Amount}
                        onChange={handleInputChange}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium mb-1 text-left">Description</label>
                        <textarea
                            name="Description"
                            placeholder="Description"
                            value={commission.Description}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
                            style={{
                                borderColor: currentTheme.divider,
                                color: currentTheme.text.primary,
                                background: currentTheme.background.paper
                            }}
                            rows="3"
                            required
                        ></textarea>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default NewCommIN;