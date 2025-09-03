import React, { useState, useEffect } from 'react';
import { fetchFees, fetchCBZIncoming, fetchCBZOutgoing, fetchZBIncoming, fetchZBOutgoing } from '../../api/viewPaymentsApi';
import FeeReportPanel from './feeReportPanel';
import AIReportPanel from './AIReportPanel';
import Loader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import { generateCashflowReportWithAI, generateFeeReportWithAI } from '../../../db/firebaseConfig';

const TermlyReport = () => {
    const [feePayments, setFeePayments] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTerm, setSelectedTerm] = useState('1'); // Default to First Term
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    useEffect(() => {
        fetchAll(selectedTerm, selectedYear);
        // eslint-disable-next-line
    }, [selectedTerm, selectedYear]);

    const fetchAll = async (termId, year) => {
        setLoading(true);
        try {
            const terms = [
                { id: '1', label: 'First Term', startDate: '-01-01', endDate: '-04-30' },
                { id: '2', label: 'Second Term', startDate: '-05-01', endDate: '-08-31' },
                { id: '3', label: 'Third Term', startDate: '-09-01', endDate: '-12-31' }
            ];
            const term = terms.find(t => t.id === termId);
            const startDate = `${year}${term.startDate}`;
            const endDate = `${year}${term.endDate}`;
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
            addToast('Error fetching termly data.', 'error');
            setLoading(false);
        }
    };

    // Adapter for AIReportPanel (cashflow)
    const handleGenerateCashflowReport = async ({ periodLabel, data }) => {
        const { incoming, outgoing } = data;
        const result = await generateCashflowReportWithAI({ periodLabel, periodType: 'term', incoming, outgoing });
        if (result && result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            return { summary: result.candidates[0].content.parts[0].text };
        }
        return result;
    };
    // Adapter for FeeReportPanel
    const handleGenerateFeeReport = async ({ periodLabel, data }) => {
        const result = await generateFeeReportWithAI({ periodLabel, periodType: 'term', feePayments: data });
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
                <select
                    value={selectedTerm}
                    onChange={e => setSelectedTerm(e.target.value)}
                    className="px-4 py-2 border rounded-lg mr-2"
                    style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }}
                >
                    <option value="1">First Term</option>
                    <option value="2">Second Term</option>
                    <option value="3">Third Term</option>
                </select>
                <input
                    type="number"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                    style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary, borderColor: currentTheme.divider }}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeeReportPanel selectedDate={`${selectedYear} Term ${selectedTerm}`} feePayments={feePayments} generateReport={handleGenerateFeeReport} />
                <AIReportPanel
                    title="Cashflow Report"
                    prompt="Summarize the cashflow for the selected term."
                    data={{ incoming, outgoing }}
                    periodLabel={`${selectedYear} Term ${selectedTerm}`}
                    generateReport={handleGenerateCashflowReport}
                    description="AI-generated summary of all incoming and outgoing bank transactions for the selected term."
                />
            </div>
        </div>
    );
};

export default TermlyReport;