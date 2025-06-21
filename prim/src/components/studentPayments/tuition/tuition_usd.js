import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import { fetchTuitionUSD } from '../../api/viewPaymentsApi';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../UIcomponents/dataTable';

const ITEMS_PER_PAGE = 10;

const TuitionUSD = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const { data: userData, isLoading: userLoading } = useQuery({
            queryKey: ['user'],
            queryFn: fetchUser,
            onError: () => navigate('/login')
        });

    const { data: usdTuitions = [], isLoading: tuitionsLoading } = useQuery({
            queryKey: ['tuitionUSD'],
            queryFn: fetchTuitionUSD,
            enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role)
        });

    const loading = userLoading || tuitionsLoading;

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
            render: (row) => row.transaction_type
        },
        {
            header: 'Payment Type',
            render: (row) => row.form
        }
    ];

    return (
        <div className='container mx-auto p-6 bg-white rounded-lg shadow-md overflow-hidden'>
            <DataTable
                columns={columns}
                data={usdTuitions}
                currentPage={currentPage}
                totalPages={Math.ceil(usdTuitions.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                isLoading={loading}
            />
        </div>
    );
};

export default TuitionUSD;