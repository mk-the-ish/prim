import React, { useState, useEffect } from 'react';
import { fetchFees, fetchCBZIncoming, fetchCBZOutgoing, fetchZBIncoming, fetchZBOutgoing } from '../../api/viewPaymentsApi';
import Loader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import FeeReportPanel from './feeReportPanel';
import supabase from '../../../db/SupaBaseConfig';
import AIReportPanel from './AIReportPanel';
import {generateFeeReportWithAI, generateCashflowReportWithAI } from '../../../db/firebaseConfig';

const DailyReport = () => {
    const [feePayments, setFeePayments] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiReport, setAiReport] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    useEffect(() => {
        fetchAll(selectedDate);
        // eslint-disable-next-line
    }, [selectedDate]);

    const fetchTransactions = async (flow, date, bank) => {
        const { data, error } = await supabase
            .from(flow === 'incoming' ? 'IncomingBankTransactions' : 'OutgoingBankTransactions')
            .select('*')
            .eq('Bank', bank)
            .eq('Date', date)
        if (error) throw error;
        return data;
    };

    const fetchAll = async (date) => {
        setLoading(true);
        try {
            const allFees = await fetchFees();
            setFeePayments(allFees.filter(txn => txn.Date === date));
            const [cbzIn, cbzOut, zbIn, zbOut] = await Promise.all([
                fetchTransactions('incoming', date, 'cbz'),
                fetchTransactions('outgoing', date, 'cbz'),
                fetchTransactions('incoming', date, 'zb'),
                fetchTransactions('outgoing', date, 'zb')
            ]);
            setIncoming([...cbzIn, ...zbIn]);
            setOutgoing([...cbzOut, ...zbOut]);
            setLoading(false);
        } catch (error) {
            addToast('Error fetching daily data.', 'error');
            setLoading(false);
        }
    };

    // Adapter for AIReportPanel (cashflow)
    const handleGenerateCashflowReport = async ({ periodLabel, data }) => {
        const { incoming, outgoing } = data;
        return await generateCashflowReportWithAI({ periodLabel, periodType: 'day', incoming, outgoing });
    };

    // Adapter for FeeReportPanel
    const handleGenerateFeeReport = async ({ periodLabel, data }) => {
        return await generateFeeReportWithAI({ periodLabel, periodType: 'day', feePayments: data });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}>
                <Loader type="card" count={2} />
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-8" style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}>
            <div className="mb-6 flex gap-4 items-center">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="px-2 py-1 border rounded mr-4"
                    style={{ color: currentTheme.text?.primary, background: currentTheme.background?.paper }}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeeReportPanel selectedDate={selectedDate} feePayments={feePayments} generateReport={handleGenerateFeeReport} />
                <AIReportPanel
                    title="Cashflow Report"
                    prompt="Summarize the cashflow for the selected date."
                    data={{ incoming, outgoing }}
                    periodLabel={selectedDate}
                    generateReport={handleGenerateCashflowReport}
                    description="AI-generated summary of all incoming and outgoing bank transactions for the selected date."
                />
            </div>
        </div>
    );
};

export default DailyReport;


