import React, { useState, useEffect } from 'react';
import { fetchFees, fetchCBZIncoming, fetchCBZOutgoing, fetchZBIncoming, fetchZBOutgoing } from '../../api/viewPaymentsApi';
import FeeReportPanel from './feeReportPanel';
import AIReportPanel from './AIReportPanel';
import Loader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import { generateCashflowReportWithAI, generateFeeReportWithAI } from '../../../db/firebaseConfig';

const MonthlyReport = () => {
    const [feePayments, setFeePayments] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    useEffect(() => {
        fetchAll(selectedMonth);
        // eslint-disable-next-line
    }, [selectedMonth]);

    const fetchAll = async (month) => {
        setLoading(true);
        try {
            const startDate = `${month}-01`;
            const endDate = new Date(
                month.split('-')[0],
                month.split('-')[1],
                0
            ).toISOString().split('T')[0];
            const allFees = await fetchFees();
            setFeePayments(allFees.filter(txn => txn.Date >= startDate && txn.Date <= endDate));
            const [cbzIn, cbzOut, zbIn, zbOut] = await Promise.all([
                fetchCBZIncoming(startDate, endDate),
                fetchCBZOutgoing(startDate, endDate),
                fetchZBIncoming(startDate, endDate),
                fetchZBOutgoing(startDate, endDate)
            ]);
            setIncoming([...cbzIn, ...zbIn]);
            setOutgoing([...cbzOut, ...zbOut]);
            setLoading(false);
        } catch (error) {
            addToast('Error fetching monthly data.', 'error');
            setLoading(false);
        }
    };

    // Adapter for AIReportPanel (cashflow)
    const handleGenerateCashflowReport = async ({ periodLabel, data }) => {
        const { incoming, outgoing } = data;
        const result = await generateCashflowReportWithAI({ periodLabel, periodType: 'month', incoming, outgoing });
        if (result && result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            return { summary: result.candidates[0].content.parts[0].text };
        }
        return result;
    };

    // Adapter for FeeReportPanel
    const handleGenerateFeeReport = async ({ periodLabel, data }) => {
        const result = await generateFeeReportWithAI({ periodLabel, periodType: 'month', feePayments: data });
        if (result && result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            return { summary: result.candidates[0].content.parts[0].text };
        }
        return result;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]" style={{ background: currentTheme.background?.default }}>
                <Loader type="card" count={2} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex gap-4 items-center">
                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                    style={{
                        background: currentTheme.background?.paper,
                        color: currentTheme.text?.primary,
                        borderColor: currentTheme.divider
                    }}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeeReportPanel
                    selectedDate={selectedMonth}
                    feePayments={feePayments}
                    generateReport={handleGenerateFeeReport}
                />
                <AIReportPanel
                    title="Cashflow Report"
                    prompt="Summarize the cashflow for the selected month."
                    data={{ incoming, outgoing }}
                    periodLabel={selectedMonth}
                    generateReport={handleGenerateCashflowReport}
                    description="AI-generated summary of all incoming and outgoing bank transactions for the selected month."
                />
            </div>
        </div>
    );
};

export default MonthlyReport;