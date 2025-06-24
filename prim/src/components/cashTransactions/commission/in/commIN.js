import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../../api/userApi';
import { fetchCommissions } from '../../../api/viewPaymentsApi';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../ui/dataTable';
import Button from '../../../../components/ui/button';
import Loader from '../../../../components/ui/loader';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useToast } from '../../../../contexts/ToastContext';
import Card from '../../../ui/card';

const ITEMS_PER_PAGE = 10;

const CommIN = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
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

    const commissionsIn = commissions.filter(commission => commission.flow === 'in');


    const filteredCommissions = commissionsIn.filter((commission) =>
        commission.Payee?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Date', accessor: (row) => new Date(row.Date).toLocaleDateString() },
        { header: 'Payee', accessor: 'Payee' },
        { header: 'Amount', accessor: 'Amount' },
        { header: 'Description', accessor: 'Description' }
    ];

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
            <Card title={'Commission In'} className="mb-6">
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
                        onClick={() => navigate('/newCommIn')}
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
        </div>
    );
};

export default CommIN;