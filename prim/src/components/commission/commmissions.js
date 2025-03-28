import React, { useState, useEffect } from 'react';
import supabase from '../../SupaBaseConfig';
import { Input } from '@/components/ui/input'; // Assuming you have Shadcn Input
import { Button } from '@/components/ui/button'; // Assuming you have Shadcn Button
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming you have Shadcn Card
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Assuming Shadcn Form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from "@/lib/utils"; // Assuming you have the cn utility
import { motion, AnimatePresence } from 'framer-motion';

// Form schema for commission entries
const commissionFormSchema = z.object({
    Date: z.date(),
    Description: z.string().min(1, { message: 'Description is required' }),
    From: z.string().optional(), // Only for commissions_in
    To: z.string().optional(),     // Only for commissions_out
    Amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
});

// Component to display and manage commissions
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
            // Fetch commissions_in, excluding created_at
            const { data: commissionsInData, error: commissionsInError } = await supabase
                .from('commissions_in')
                .select('id, Date, Description, From, Amount');

            if (commissionsInError) throw commissionsInError;
            setCommissionsIn(commissionsInData);

            // Fetch commissions_out, excluding created_at
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

    // Fetch data on component mount
    useEffect(() => {
        fetchCommissions();
    }, []);

    // --- Form Setup (React Hook Form) ---
    const form = useForm < z.infer < typeof commissionFormSchema >> ({
        resolver: zodResolver(commissionFormSchema),
        defaultValues: {
            Date: new Date(),
            Description: '',
            Amount: 0,
            From: isCommissionsIn ? '' : undefined,
            To: !isCommissionsIn ? '' : undefined,
        },
    });

    // --- Form Submission Handler ---
    const onSubmit = async (data) => {
        try {
            const table = isCommissionsIn ? 'commissions_in' : 'commissions_out';
            const { error } = await supabase.from(table).insert([data]);

            if (error) {
                console.error(`Error adding commission to ${table}:`, error);
                alert(`Failed to add commission. Please check the console for errors.`); // Basic error notification
            } else {
                // Refresh data and close form
                await fetchCommissions();
                setShowAddForm(false);
                form.reset(); // Reset form to default values
                alert(`Commission added successfully!`);
            }
        } catch (error) {
            console.error("Error during submission", error);
            alert(`An unexpected error occurred. Please check the console.`);
        }
    };

    // --- Search Handlers ---
    const handleSearchIn = (e) => {
        setSearchIn(e.target.value);
    };

    const handleSearchOut = (e) => {
        setSearchOut(e.target.value);
    };

    // --- Filtered Data ---
    const filteredCommissionsIn = commissionsIn.filter(item =>
        item.From?.toLowerCase().includes(searchIn.toLowerCase())
    );

    const filteredCommissionsOut = commissionsOut.filter(item =>
        item.To?.toLowerCase().includes(searchOut.toLowerCase())
    );

    // --- Animation Variants ---
    const formVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    };

    if (loading) {
        return <p>Loading commissions data...</p>; // Simple loading state
    }

    return (
        <div className="flex w-full">
            {/* Left Panel: Commissions In */}
            <div className="w-1/2 p-4 border-r">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Commissions In</h2>
                    <Input
                        type="text"
                        placeholder="Search From..."
                        value={searchIn}
                        onChange={handleSearchIn}
                        className="w-64"
                    />
                    <Button onClick={() => {
                        setShowAddForm(true);
                        setIsCommissionsIn(true);
                        form.reset({  // Reset form when Add New is clicked
                            Date: new Date(),
                            Description: '',
                            Amount: 0,
                            From: '',
                        });
                    }}
                    >
                        Add New
                    </Button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCommissionsIn.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(item.Date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.Description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.From}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.Amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Right Panel: Commissions Out */}
            <div className="w-1/2 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Commissions Out</h2>
                    <Input
                        type="text"
                        placeholder="Search To..."
                        value={searchOut}
                        onChange={handleSearchOut}
                        className="w-64"
                    />
                    <Button onClick={() => {
                        setShowAddForm(true);
                        setIsCommissionsIn(false);
                        form.reset({  // Reset form when Add New is clicked.
                            Date: new Date(),
                            Description: '',
                            Amount: 0,
                            To: '',
                        });
                    }}
                    >
                        Add New
                    </Button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCommissionsOut.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(item.Date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.Description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.To}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.Amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Floating Card for Add New Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>{isCommissionsIn ? 'Add Commission In' : 'Add Commission Out'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="Date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Description" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {isCommissionsIn ? (
                                            <FormField
                                                control={form.control}
                                                name="From"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>From</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="From" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <FormField
                                                control={form.control}
                                                name="To"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>To</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="To" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                        <FormField
                                            control={form.control}
                                            name="Amount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Amount</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="Amount" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-end gap-4">
                                            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                                            <Button type="submit">Add</Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Commissions;
