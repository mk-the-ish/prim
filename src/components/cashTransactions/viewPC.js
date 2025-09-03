import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/button';
import Card from '../ui/card';
import Form from '../ui/form';
import FormModal from '../ui/FormModal';
import supabase from '../../db/SupaBaseConfig';
import TopBar from '../ui/topbar'; 
import { Link } from 'react-router-dom'; 

const pettyCategories = [
    'Transport and Subsistence',
    'Staff Provisions',
    'Sports',
    'Repairs and Maintenance',
    'Airtime',
    'Others'
];

const cbzCategories = [
     'petty cash'
];

const ViewPC = () => {
    const { currentTheme } = useTheme();
    const { addToast } = useToast();
    const [showPettyModal, setShowPettyModal] = useState(false);
    const [showCBZModal, setShowCBZModal] = useState(false);
    const [pettyForm, setPettyForm] = useState({
        Date: '',
        Recepient: '',
        Description: '',
        Category: '',
        Amount: ''
    });
    const [cbzForm, setCBZForm] = useState({
        Date: '',
        Description: '',
        To: '',
        Amount: '',
        Category: 'levy',
        Reference: '',
        Account: '' 
    });
    const [accountOptions, setAccountOptions] = useState([]);

    // Fetch account options for CBZ modal
    useEffect(() => {
        supabase
            .from('Accounts')
            .select('id, Bank, Branch, AccNumber, Currency')
            .then(({ data }) => {
                if (data) setAccountOptions(data);
            });
    }, []);
    // Fetch transactions
    const { data: creditTransactions = [] } = useQuery({
        queryKey: ['pettyCashTransactions'],
        queryFn: async () => {
            let { data, error } = await supabase.from('PettyCash').select('*').order('Date', { ascending: false });
            if (error) return [];
            return data || [];
        }
    });
    const { data: debitTransactions = [] } = useQuery({
        queryKey: ['cbzPettyCashTransactions'],
        queryFn: async () => {
            let { data, error } = await supabase.from('OutgoingBankTransactions').select('*').eq('Bank', 'cbz').eq('Currency', 'usd').eq('Category', 'petty cash').order('Date', { ascending: false });
            if (error) return [];
            return data || [];
        }
    });
    const totalDebit = debitTransactions.reduce((sum, tx) => sum + Number(tx.Amount), 0);
    const totalCredit = creditTransactions.reduce((sum, tx) => sum + Number(tx.Amount || tx.amount), 0);
    const balance = totalDebit - totalCredit;

    // Petty Cash Mutation
    const pettyMutation = useMutation({
        mutationFn: async (form) => {
            const { error } = await supabase.from('PettyCash').insert([
                {
                    Date: form.Date,
                    Recepient: form.Recepient,
                    Description: form.Description,
                    Category: form.Category,
                    Amount: parseFloat(form.Amount)
                }
            ]);
            if (error) throw error;
        },
        onSuccess: () => {
            addToast('Petty cash transaction added!', 'success');
            setShowPettyModal(false);
            setPettyForm({ Date: '', Recepient: '', Description: '', Category: '', Amount: '' });
        },
        onError: () => {
            addToast('Failed to add petty cash transaction.', 'error');
        }
    });
    // CBZ Out Mutation
    const cbzMutation = useMutation({
        mutationFn: async (form) => {
            const { error } = await supabase.from('OutgoingBankTransactions').insert([{
                Date: form.Date,
                Description: form.Description,
                To: form.To,
                Amount: parseFloat(form.Amount),
                Category: form.Category,
                Reference: form.Reference,
                Account: form.Account ? parseInt(form.Account) : null // <-- corrected
            }]);
            if (error) throw error;
        },
        onSuccess: () => {
            addToast('CBZ withdrawal recorded!', 'success');
            setShowCBZModal(false);
            setCBZForm({ Date: '', Description: '', To: '', Amount: '', Category: 'levy', Reference: '', Account: '' });
        },
        onError: () => {
            addToast('Failed to record CBZ withdrawal.', 'error');
        }
    });

    return (
        <div className="p-6" style={{ background: currentTheme.background?.default, minHeight: '100vh' }}>
            <TopBar title="Petty Cash" />
            <div className="mb-4">
                <Link
                    to="/commission"
                    className="inline-block px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90"
                >
                    Go to Commissions Page
                </Link>
            </div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: currentTheme.primary?.main }}>Petty Cash Balance</h2>
                <p className="text-xl font-semibold" style={{ color: currentTheme.text?.primary }}>${balance.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Debit Side */}
                <Card title="Debit (Money In)" variant="secondary">
                    <div className="overflow-x-auto">
                        <table className="min-w-full" style={{ background: currentTheme.background?.paper }}>
                            <thead>
                                <tr>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Date</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Description</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {debitTransactions.map((tx, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{tx.Date}</td>
                                        <td className="border p-2">{tx.Description}</td>
                                        <td className="border p-2">${Number(tx.Amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button
                        onClick={() => setShowCBZModal(true)}
                        variant="primary"
                        className="mt-4"
                    >
                        Withdraw From CBZ
                    </Button>
                </Card>
                {/* Credit Side */}
                <Card title="Credit (Money Out)" variant="secondary">
                    <div className="overflow-x-auto">
                        <table className="min-w-full" style={{ background: currentTheme.background?.paper }}>
                            <thead>
                                <tr>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Date</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Recipient</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Description</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Category</th>
                                    <th className="border p-2" style={{ color: currentTheme.text?.secondary }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creditTransactions.map((tx, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{tx.Date || tx.date}</td>
                                        <td className="border p-2">{tx.Recepient || tx.Receipient}</td>
                                        <td className="border p-2">{tx.Description}</td>
                                        <td className="border p-2">{tx.Category}</td>
                                        <td className="border p-2">${Number(tx.Amount || tx.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button
                        onClick={() => setShowPettyModal(true)}
                        variant="success"
                        className="mt-4"
                    >
                        Add New Transaction
                    </Button>
                </Card>
            </div>
            {/* Petty Cash Modal */}
            <FormModal open={showPettyModal} onClose={() => setShowPettyModal(false)} title="Add Petty Cash Transaction">
                <Form onSubmit={e => { e.preventDefault(); pettyMutation.mutate(pettyForm); }} loading={pettyMutation.isLoading}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Form.Input
                            label="Recipient"
                            type="text"
                            name="Recepient"
                            value={pettyForm.Recepient}
                            onChange={e => setPettyForm({ ...pettyForm, Recepient: e.target.value })}
                            required
                        />
                        <Form.Input
                            label="Date"
                            type="date"
                            name="Date"
                            value={pettyForm.Date}
                            onChange={e => setPettyForm({ ...pettyForm, Date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <Form.Input
                            label="Description"
                            type="text"
                            name="Description"
                            value={pettyForm.Description}
                            onChange={e => setPettyForm({ ...pettyForm, Description: e.target.value })}
                            required
                        />
                        <Form.Select
                            label="Category"
                            name="Category"
                            value={pettyForm.Category}
                            onChange={e => setPettyForm({ ...pettyForm, Category: e.target.value })}
                            options={pettyCategories}
                            required
                        />
                        <Form.Input
                            label="Amount"
                            type="number"
                            name="Amount"
                            value={pettyForm.Amount}
                            onChange={e => setPettyForm({ ...pettyForm, Amount: e.target.value })}
                            required
                        />
                    </div>
                </Form>
            </FormModal>
            {/* CBZ Out Modal */}
            <FormModal open={showCBZModal} onClose={() => setShowCBZModal(false)} title="Withdraw From CBZ">
                <Form onSubmit={e => { e.preventDefault(); cbzMutation.mutate(cbzForm); }} loading={cbzMutation.isLoading}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Form.Input
                            label="Date"
                            type="date"
                            name="Date"
                            value={cbzForm.Date}
                            onChange={e => setCBZForm({ ...cbzForm, Date: e.target.value })}
                            required
                        />
                        <Form.Input
                            label="To"
                            type="text"
                            name="To"
                            value={cbzForm.To}
                            onChange={e => setCBZForm({ ...cbzForm, To: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <Form.Input
                            label="Description"
                            type="text"
                            name="Description"
                            value={cbzForm.Description}
                            onChange={e => setCBZForm({ ...cbzForm, Description: e.target.value })}
                            required
                        />
                        <Form.Select
                            label="Category"
                            name="Category"
                            value={cbzForm.Category}
                            onChange={e => setCBZForm({ ...cbzForm, Category: e.target.value })}
                            options={cbzCategories}
                            required
                        />
                        <Form.Input
                            label="Amount"
                            type="number"
                            name="Amount"
                            value={cbzForm.Amount}
                            onChange={e => setCBZForm({ ...cbzForm, Amount: e.target.value })}
                            required
                        />
                        <Form.Input
                            label="Reference"
                            type="text"
                            name="Reference"
                            value={cbzForm.Reference}
                            onChange={e => setCBZForm({ ...cbzForm, Reference: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <Form.Select
                            label="Account"
                            name="Account" // <-- corrected
                            value={cbzForm.Account}
                            onChange={e => setCBZForm({ ...cbzForm, Account: e.target.value })}
                            options={[
                                { value: '', label: 'Select Account' },
                                ...accountOptions.map(acc => ({
                                    value: acc.id,
                                    label: `${acc.Bank} - ${acc.Branch} - ${acc.AccNumber} (${acc.Currency})`
                                }))
                            ]}
                            required
                        />
                    </div>
                </Form>
            </FormModal>
        </div>
    );
};

export default ViewPC;
