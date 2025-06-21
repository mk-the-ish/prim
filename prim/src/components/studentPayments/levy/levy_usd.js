import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../api/userApi';
import { fetchLevyUSD } from '../../api/viewPaymentsApi';
import DataTable from '../../../UIcomponents/dataTable';

const ITEMS_PER_PAGE = 10;

const LevyUSD = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login')
    });

    const { data: usdLevies = [], isLoading: leviesLoading } = useQuery({
        queryKey: ['levyUSD'],
        queryFn: fetchLevyUSD,
        enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role)
    });

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
            accessor: 'Amount'
        },
        {
            header: 'Transaction Method',
            accessor: 'transaction_type'
        },
        {
            header: 'Payment Type',
            accessor: 'form'
        }
    ];

    return (
        <DataTable
            columns={columns}
            data={usdLevies}
            currentPage={currentPage}
            totalPages={Math.ceil(usdLevies.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            isLoading={userLoading || leviesLoading}
        />
    );
};

export default LevyUSD;