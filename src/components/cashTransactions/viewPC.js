import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/button';
import Card from '../ui/card';
import Form from '../ui/form';
import FormModal from '../ui/FormModal';
import TopBar from '../ui/topbar';
import { Link } from 'react-router-dom';
import {
    fetchCashTransactions,
    fetchBankTransactions,
    addCashTransaction,
    addBankTransaction,
    fetchAccountOptions
} from '../api/viewPaymentsApi';

const pettyCategories = [
    'Transport and Subsistence',
    'Staff Provisions',
    'Sports',
    'Repairs and Maintenance',
    'Airtime',
    'Others'
];

const bankCategories = [
    'petty cash'
    
];

const tableHeaderClass = "px-4 py-2 bg-gray-100 text-gray-700 font-semibold border-b";
const tableCellClass = "px-4 py-2 border-b";

const ViewPC = () => {
    const { currentTheme } = useTheme();
    const { addToast } = useToast();
    const [showPettyModal, setShowPettyModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [pettyForm, setPettyForm] = useState({
        date: '',
        recipient: '',
        description: '',
        category: '',
        amount: ''
    });
    const [bankForm, setBankForm] = useState({
        date: '',
        description: '',
        payee: '',
        amount: '',
        category: 'petty cash',
        accountId: '',
    });
    const [accountOptions, setAccountOptions] = useState([]);

    // Fetch account and bank options for modal dropdowns
    useEffect(() => {
        fetchAccountOptions().then(data => setAccountOptions(data || []));
    }, []);

    // Fetch petty cash transactions (Money Out)
    const { data: cashTransactions = [], refetch: refetchCash } = useQuery({
        queryKey: ['cashTransactions'],
        queryFn: fetchCashTransactions
    });

    // Fetch bank transactions (Money In)
    const { data: bankTransactions = [], refetch: refetchBank } = useQuery({
        queryKey: ['bankTransactions'],
        queryFn: fetchBankTransactions
    });

    const totalBankIn = bankTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const totalCashOut = cashTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const balance = totalBankIn - totalCashOut;

    // Petty Cash Mutation
    const pettyMutation = useMutation({
        mutationFn: async (form) => {
            await addCashTransaction({
                date: form.date,
                recipient: form.recipient,
                description: form.description,
                category: form.category,
                amount: parseFloat(form.amount),
                flow: 'out'
            });
        },
        onSuccess: () => {
            addToast('Petty cash transaction added!', 'success');
            setShowPettyModal(false);
            setPettyForm({ date: '', recipient: '', description: '', category: '', amount: '' });
            refetchCash();
        },
        onError: () => {
            addToast('Failed to add petty cash transaction.', 'error');
        }
    });

    // Bank Transaction Mutation (Money In)
    const bankMutation = useMutation({
        mutationFn: async (form) => {
            await addBankTransaction({
                date: form.date,
                description: form.description,
                payee: form.payee,
                amount: parseFloat(form.amount),
                category: form.category,
                accountId: form.accountId ? parseInt(form.accountId) : null,
                flow: 'out'
            });
        },
        onSuccess: () => {
            addToast('Bank withdrawal recorded!', 'success');
            setShowBankModal(false);
            setBankForm({ date: '', description: '', payee: '', amount: '', category: 'petty cash', reference: '', accountId: '' });
            refetchBank();
        },
        onError: () => {
            addToast('Failed to record bank withdrawal.', 'error');
        }
    });

    return (
        <div className="p-6" style={{ background: currentTheme.background?.default, minHeight: '100vh' }}>
            <TopBar title="Petty Cash" />
            <div className="mt-6 mb-6 flex justify-start">
                <Link to="/commission">
                    <Button variant="primary">
                        Go to Commissions Page
                    </Button>
                </Link>
            </div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold" style={{ color: currentTheme.primary?.main }}>Petty Cash Balance</h2>
                <p className="text-xl font-semibold" style={{ color: currentTheme.text?.primary }}>${balance.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bank Side (Money In) */}
                <Card title="Bank Transactions (Money In)" variant="secondary">
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full bg-white rounded-lg">
                            <thead>
                                <tr>
                                    <th className={tableHeaderClass}>Date</th>
                                    <th className={tableHeaderClass}>Bank</th>
                                    <th className={tableHeaderClass}>Description</th>
                                    <th className={tableHeaderClass}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bankTransactions.length === 0 ? (
                                    <tr>
                                        <td className={tableCellClass} colSpan={4}>
                                            <span className="text-gray-400">No bank transactions found.</span>
                                        </td>
                                    </tr>
                                ) : (
                                    bankTransactions.map((tx, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition">
                                            <td className={tableCellClass}>{tx.date}</td>
                                            <td className={tableCellClass}>
                                                {(() => {
                                                    const acc = accountOptions.find(a => a.id === tx.accountId);
                                                    return acc ? acc.bank : '-';
                                                })()}
                                            </td>
                                            <td className={tableCellClass}>{tx.description}</td>
                                            <td className={tableCellClass}>${Number(tx.amount).toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={() => setShowBankModal(true)}
                            variant="primary"
                        >
                            Withdraw From Bank
                        </Button>
                    </div>
                </Card>
                {/* Petty Cash Side (Money Out) */}
                <Card title="Petty Cash Transactions (Money Out)" variant="secondary">
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full bg-white rounded-lg">
                            <thead>
                                <tr>
                                    <th className={tableHeaderClass}>Date</th>
                                    <th className={tableHeaderClass}>Recipient</th>
                                    <th className={tableHeaderClass}>Description</th>
                                    <th className={tableHeaderClass}>Category</th>
                                    <th className={tableHeaderClass}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cashTransactions.length === 0 ? (
                                    <tr>
                                        <td className={tableCellClass} colSpan={5}>
                                            <span className="text-gray-400">No petty cash transactions found.</span>
                                        </td>
                                    </tr>
                                ) : (
                                    cashTransactions.map((tx, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition">
                                            <td className={tableCellClass}>{tx.date}</td>
                                            <td className={tableCellClass}>{tx.recipient}</td>
                                            <td className={tableCellClass}>{tx.description}</td>
                                            <td className={tableCellClass}>{tx.category}</td>
                                            <td className={tableCellClass}>${Number(tx.amount).toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={() => setShowPettyModal(true)}
                            variant="success"
                        >
                            Add New Transaction
                        </Button>
                    </div>
                </Card>
            </div>
            {/* Petty Cash Modal */}
            <FormModal open={showPettyModal} onClose={() => setShowPettyModal(false)} title="Add Petty Cash Transaction">
                <Form onSubmit={e => { e.preventDefault(); pettyMutation.mutate(pettyForm); }} loading={pettyMutation.isLoading}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Form.Input
                            label="Recipient"
                            type="text"
                            name="recipient"
                            value={pettyForm.recipient}
                            onChange={e => setPettyForm({ ...pettyForm, recipient: e.target.value })}
                            required
                        />
                        <Form.Input
                            label="Date"
                            type="date"
                            name="date"
                            value={pettyForm.date}
                            onChange={e => setPettyForm({ ...pettyForm, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <Form.Input
                            label="Description"
                            type="text"
                            name="description"
                            value={pettyForm.description}
                            onChange={e => setPettyForm({ ...pettyForm, description: e.target.value })}
                            required
                        />
                        <Form.Select
                            label="Category"
                            name="category"
                            value={pettyForm.category}
                            onChange={e => setPettyForm({ ...pettyForm, category: e.target.value })}
                            options={pettyCategories}
                            required
                        />
                        <Form.Input
                            label="Amount"
                            type="number"
                            name="amount"
                            value={pettyForm.amount}
                            onChange={e => setPettyForm({ ...pettyForm, amount: e.target.value })}
                            required
                        />
                    </div>
                </Form>
            </FormModal>
            {/* Bank Modal */}
            <FormModal open={showBankModal} onClose={() => setShowBankModal(false)} title="Withdraw From Bank">
                <Form onSubmit={e => { e.preventDefault(); bankMutation.mutate(bankForm); }} loading={bankMutation.isLoading}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Form.Input
                            label="Date"
                            type="date"
                            name="date"
                            value={bankForm.date}
                            onChange={e => setBankForm({ ...bankForm, date: e.target.value })}
                            required
                        />
                        <Form.Input
                            label="To"
                            type="text"
                            name="payee"
                            value={bankForm.payee}
                            onChange={e => setBankForm({ ...bankForm, payee: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <Form.Input
                            label="Description"
                            type="text"
                            name="description"
                            value={bankForm.description}
                            onChange={e => setBankForm({ ...bankForm, description: e.target.value })}
                            required
                        />
                        <Form.Select
                            label="Category"
                            name="category"
                            value={bankForm.category}
                            onChange={e => setBankForm({ ...bankForm, category: e.target.value })}
                            options={bankCategories}
                            required
                        />
                        <Form.Input
                            label="Amount"
                            type="number"
                            name="amount"
                            value={bankForm.amount}
                            onChange={e => setBankForm({ ...bankForm, amount: e.target.value })}
                            required
                        />
                        <Form.Input
                            label="Reference"
                            type="text"
                            name="reference"
                            value={bankForm.reference}
                            onChange={e => setBankForm({ ...bankForm, reference: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <Form.Select
                            label="Account"
                            name="accountId"
                            value={bankForm.accountId}
                            onChange={e => setBankForm({ ...bankForm, accountId: e.target.value })}
                            options={[
                                { value: '', label: 'Select Account' },
                                ...accountOptions.map(acc => ({
                                    value: acc.id,
                                    label: `${acc.bank} - ${acc.branch} - ${acc.accNumber} (${acc.currency})`
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
