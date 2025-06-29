import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import { fetchCommissions, addCommission } from '../../api/viewPaymentsApi';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../ui/dataTable';
import Button from '../../ui/button';
import Loader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import Card from '../../ui/card';
import FormModal from '../../ui/FormModal';
import Form from '../../ui/form';

const ITEMS_PER_PAGE = 10;

const CommOUT = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formValues, setFormValues] = useState({
        Date: '',
        Payee: '',
        Amount: '',
        Description: ''
    });
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => {
            addToast('Authentication required. Please login.', 'error');
            navigate('/login');
        },
        onSuccess: (data) => {
            if (!data || !['admin', 'bursar'].includes(data.role)) {
                addToast('You are not authorized to view this page.', 'error');
                navigate('/unauthorised');
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 0
    });

    const { data: commissions = [], isLoading: commissionsLoading } = useQuery({
        queryKey: ['commissions'],
        queryFn: fetchCommissions,
        enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role)
    });

    const commissionsOut = commissions.filter(f => f.flow === 'out');

    const filteredCommissions = commissionsOut.filter((commission) =>
        commission.Payee?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Date', accessor: 'Date' },
        { header: 'Payee', accessor: 'Payee' },
        { header: 'Amount', accessor: 'Amount' },
        { header: 'Description', accessor: 'Description' }
    ];

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        try {
            await addCommission({
                ...formValues,
                flow: 'out',
                Amount: parseFloat(formValues.Amount),
            });
            setModalOpen(false);
            setFormValues({ Date: '', Payee: '', Amount: '', Description: '' });
            addToast('Commission added successfully!', 'success');
        } catch (err) {
            setFormError(err.message || 'Failed to add commission');
        } finally {
            setFormLoading(false);
        }
    };

    if (userLoading || commissionsLoading) {
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
            style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}
        >
            <Card title="Commission Payments Out" className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search Payee..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 w-1/2"
                        style={{
                            borderColor: currentTheme.divider,
                            background: currentTheme.background?.default,
                            color: currentTheme.text?.primary
                        }}
                    />
                    <Button
                        onClick={() => setModalOpen(true)}
                        variant="primary"
                        className="px-4 py-2"
                    >
                        Add New
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredCommissions}
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredCommissions.length / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    isLoading={userLoading || commissionsLoading}
                />
            </Card>
            <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Commission Out">
                <Form onSubmit={handleFormSubmit} loading={formLoading}>
                    <Form.Input
                        label="Date"
                        name="Date"
                        type="date"
                        value={formValues.Date}
                        onChange={handleFormChange}
                        required
                    />
                    <Form.Input
                        label="Payee"
                        name="Payee"
                        value={formValues.Payee}
                        onChange={handleFormChange}
                        required
                    />
                    <Form.Input
                        label="Amount"
                        name="Amount"
                        type="number"
                        step="0.01"
                        value={formValues.Amount}
                        onChange={handleFormChange}
                        required
                    />
                    <Form.Input
                        label="Description"
                        name="Description"
                        value={formValues.Description}
                        onChange={handleFormChange}
                        required
                    />
                    {formError && <div className="text-red-500 text-sm mt-2">{formError}</div>}
                </Form>
            </FormModal>
        </div>
    );
};

export default CommOUT;