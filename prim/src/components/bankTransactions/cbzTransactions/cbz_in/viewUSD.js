import React, { useState, useEffect } from 'react';
import supabase from '../../../../db/SupaBaseConfig';
import Card from '../../../ui/card';
import SkeletonLoader from '../../../ui/loader';
import DataTable from '../../../ui/dataTable';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Created At', render: row => new Date(row.created_at).toLocaleString() },
    { header: 'Date', render: row => new Date(row.Date).toLocaleDateString() },
    { header: 'Description', accessor: 'Description' },
    { header: 'From', accessor: 'From' },
    { header: 'Amount', render: row => `$${Number(row.Amount).toFixed(2)}` },
];

const LIVusd = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('levy_in_txn_usd')
                .select('*')
                .order('Date', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            // Optionally show a toast here
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Card title="USD Levy Revenue">
                {loading ? (
                    <SkeletonLoader type="card" count={1} />
                ) : (
                    <DataTable
                        columns={columns}
                        data={transactions}
                        currentPage={1}
                        totalPages={1}
                        itemsPerPage={transactions.length}
                        onPageChange={() => { }}
                    />
                )}
            </Card>
        </div>
    );
};

export default LIVusd;