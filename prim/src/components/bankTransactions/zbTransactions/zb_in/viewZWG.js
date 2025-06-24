import React, { useState, useEffect } from 'react';
import supabase from '../../../../db/SupaBaseConfig';
import { useTheme } from '../../../../contexts/ThemeContext';
import Loader from '../../../ui/loader';
import DataTable from '../../../ui/dataTable';
import Card from '../../../ui/card';

const TIVzwg = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentTheme } = useTheme();

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tuition_in_txn_zwg')
                .select('*')
                .order('Date', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Define columns for DataTable
    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Created At', accessor: row => new Date(row.created_at).toLocaleString() },
        { Header: 'Date', accessor: row => new Date(row.Date).toLocaleDateString() },
        { Header: 'Description', accessor: 'Description' },
        { Header: 'From', accessor: 'From' },
        { Header: 'Amount', accessor: row => `$${Number(row.Amount).toFixed(2)}` }
    ];

    return (
        <Card title="ZWD Tuition Revenue" className="p-6 min-h-screen">
            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <Loader type="card" />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={transactions}
                    currentPage={1}
                    totalPages={1}
                    itemsPerPage={transactions.length}
                    onPageChange={() => {}}
                />
            )}
        </Card>
    );
};

export default TIVzwg;
