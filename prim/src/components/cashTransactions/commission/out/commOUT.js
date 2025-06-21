import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../../api/userApi';
import { fetchCommissionsOut } from '../../../api/viewPaymentsApi';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../../UIcomponents/dataTable';
import Button from '../../../../components/ui/button';

const ITEMS_PER_PAGE = 10;

const CommOUT = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const { data: userData, isLoading: userLoading } = useQuery({
            queryKey: ['user'],
            queryFn: fetchUser,
            onError: () => navigate('/login'),
            onSuccess: (data) => {
                if (!data || !['admin', 'bursar'].includes(data.role)) {
                    navigate('/unauthorised');
                    return null;
                }
            },
            refetchOnWindowFocus: false,
            staleTime: 0
        });


    const { data: commissions = [], isLoading: commissionsLoading } = useQuery({
        queryKey: ['commissionsOUT'],
        queryFn: fetchCommissionsOut,
        enabled: !!userData?.role && ['admin', 'bursar'].includes(userData.role)
    });

    const filteredCommissions = commissions.filter((commission) =>
        commission.To?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Date', accessor: 'Date' },
        { header: 'To', accessor: 'TO' },
        { header: 'Amount', accessor: 'Amount' },
        { header: 'Description', accessor: 'Description' }
    ];

    return (
        <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search To..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
                />
                <Button
                    onClick={() => navigate('/newCommOut')}
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
        </div>
    );
};

export default CommOUT;