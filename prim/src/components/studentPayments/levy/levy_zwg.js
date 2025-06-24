import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import { fetchFees } from '../../api/viewPaymentsApi';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../ui/dataTable';
import Card from '../../ui/card';

const ITEMS_PER_PAGE = 10;

const LevyZWG = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login')
    });

    const { data: Fees = [], isLoading: leviesLoading } = useQuery({
        queryKey: ['fees'],
        queryFn: fetchFees,
        enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role)
    });

    const zwgLevies = Fees.filter(fee => fee.Currency === 'zwg' && fee.Type === 'levy');

    const loading = userLoading || leviesLoading;

    const columns = [
        {
            header: 'Student Name',
            render: (row) => row.Students ? `${row.Students.FirstNames} ${row.Students.Surname}` : 'N/A'
        },
        {
            header: 'Grade',
            render: (row) => row.Students?.Grade || 'N/A'
        },
        {
            header: 'Class',
            render: (row) => row.Students?.Class || 'N/A'
        },
        {
            header: 'Gender',
            render: (row) => row.Students?.Gender || 'N/A'
        },
        {
            header: 'Date',
            render: (row) => new Date(row.Date).toLocaleDateString()
        },
        {
            header: 'Amount',
            render: (row) => row.Amount
        },
        {
            header: 'Transaction Method',
            render: (row) => row.Type
        },
        {
            header: 'Payment Type',
            render: (row) => row.Form
        }
    ];

    return (
        <Card title="ZWL Levies" className="mb-4">
        <DataTable
            columns={columns}
            data={zwgLevies}
            currentPage={currentPage}
            totalPages={Math.ceil(zwgLevies.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            isLoading={loading}
            />
        </Card>
    );
};

export default LevyZWG;