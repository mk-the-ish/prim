import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../api/userApi';
import { fetchFees } from '../../api/viewPaymentsApi';
import DataTable from '../../ui/dataTable';
import Card from '../../ui/card';

const ITEMS_PER_PAGE = 10;

const LevyUSD = ({ onCurrencySwitch }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

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

    const usdLevies = Fees.filter(fee => fee.Currency === 'usd' && fee.Type === 'levy');

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
            accessor: 'Type'
        },
        {
            header: 'Payment Type',
            accessor: 'Form'
        }
    ];

    return (
        <Card title="USD Levies" className="mb-4" right={
            <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                onClick={onCurrencySwitch}
            >
                ZWG
            </button>
        }>
            <DataTable
                columns={columns}
                data={usdLevies}
                currentPage={currentPage}
                totalPages={Math.ceil(usdLevies.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                isLoading={userLoading || leviesLoading}
            />
        </Card>
    );
};

export default LevyUSD;