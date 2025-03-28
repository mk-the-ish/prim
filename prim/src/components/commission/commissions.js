import React, { useState, useEffect } from 'react';
import supabase from '../../SupaBaseConfig';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

// Form schema for commission entries
const commissionFormSchema = z.object({
    Date: z.string().nonempty({ message: 'Date is required' }),
    Description: z.string().min(1, { message: 'Description is required' }),
    From: z.string().optional(), // Only for commissions_in
    To: z.string().optional(),   // Only for commissions_out
    Amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
});

const Commissions = () => {
    const [commissionsIn, setCommissionsIn] = useState([]);
    const [commissionsOut, setCommissionsOut] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isCommissionsIn, setIsCommissionsIn] = useState(true); // true for in, false for out
    const [searchIn, setSearchIn] = useState('');
    const [searchOut, setSearchOut] = useState('');

    // Fetch commissions data from Supabase
    const fetchCommissions = async () => {
        setLoading(true);
        try {
            const { data: commissionsInData, error: commissionsInError } = await supabase
                .from('commissions_in')
                .select('id, Date, Description, From, Amount');

            if (commissionsInError) throw commissionsInError;
            setCommissionsIn(commissionsInData);

            const { data: commissionsOutData, error: commissionsOutError } = await supabase
                .from('commissions_out')
                .select('id, Date, Description, To, Amount');

            if (commissionsOutError) throw commissionsOutError;
            setCommissionsOut(commissionsOutData);
        } catch (error) {
            console.error('Error fetching commissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    // Form setup using React Hook Form
    const form = useForm({
        resolver: zodResolver(commissionFormSchema),
        defaultValues: {
            Date: '',
            Description: '',
            Amount: 0,
            From: '',
            To: '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const table = isCommissionsIn ? 'commissions_in' : 'commissions_out';
            const { error } = await supabase.from(table).insert([data]);

            if (error) {
                console.error(`Error adding commission to ${table}:`, error);
                alert('Failed to add commission. Please check the console for errors.');
            } else {
                await fetchCommissions();
                setShowAddForm(false);
                form.reset();
                alert('Commission added successfully!');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            alert('An unexpected error occurred. Please check the console.');
        }
    };

    const handleSearchIn = (e) => setSearchIn(e.target.value);
    const handleSearchOut = (e) => setSearchOut(e.target.value);

    const filteredCommissionsIn = commissionsIn.filter((item) =>
        item.From?.toLowerCase().includes(searchIn.toLowerCase())
    );

    const filteredCommissionsOut = commissionsOut.filter((item) =>
        item.To?.toLowerCase().includes(searchOut.toLowerCase())
    );

    const formVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    };

    if (loading) return <p>Loading commissions data...</p>;

    return (
        <div className="flex w-full">
            {/* Commissions In */}
            <div className="w-1/2 p-4 border-r">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Commissions In</h2>
                    <input
                        type="text"
                        placeholder="Search From..."
                        value={searchIn}
                        onChange={handleSearchIn}
                        className="border rounded p-2 w-64"
                    />
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                            setIsCommissionsIn(true);
                            form.reset({ Date: '', Description: '', Amount: 0, From: '' });
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add New
                    </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">From</th>
                            <th className="px-4 py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCommissionsIn.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2">{new Date(item.Date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{item.Description}</td>
                                <td className="px-4 py-2">{item.From}</td>
                                <td className="px-4 py-2">{item.Amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Commissions Out */}
            <div className="w-1/2 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Commissions Out</h2>
                    <input
                        type="text"
                        placeholder="Search To..."
                        value={searchOut}
                        onChange={handleSearchOut}
                        className="border rounded p-2 w-64"
                    />
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                            setIsCommissionsIn(false);
                            form.reset({ Date: '', Description: '', Amount: 0, To: '' });
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add New
                    </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">To</th>
                            <th className="px-4 py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCommissionsOut.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2">{new Date(item.Date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{item.Description}</td>
                                <td className="px-4 py-2">{item.To}</td>
                                <td className="px-4 py-2">{item.Amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <div className="bg-white rounded shadow p-6 w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4">
                                {isCommissionsIn ? 'Add Commission In' : 'Add Commission Out'}
                            </h2>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Date</label>
                                    <input
                                        type="date"
                                        {...form.register('Date')}
                                        className="border rounded p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Description</label>
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        {...form.register('Description')}
                                        className="border rounded p-2 w-full"
                                    />
                                </div>
                                {isCommissionsIn ? (
                                    <div>
                                        <label className="block text-sm font-medium">From</label>
                                        <input
                                            type="text"
                                            placeholder="From"
                                            {...form.register('From')}
                                            className="border rounded p-2 w-full"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium">To</label>
                                        <input
                                            type="text"
                                            placeholder="To"
                                            {...form.register('To')}
                                            className="border rounded p-2 w-full"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium">Amount</label>
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        {...form.register('Amount')}
                                        className="border rounded p-2 w-full"
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Commissions;