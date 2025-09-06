import React, { useState, useEffect } from 'react';
import { fetchFees, fetchLevyUSD, fetchLevyZWG, fetchTuitionUSD, fetchTuitionZWG, fetchCBZIncoming, fetchCBZOutgoing, fetchZBIncoming, fetchZBOutgoing } from '../../api/viewPaymentsApi';
import ReportCard from '../../ui/reportCard';
import Card from '../../ui/card';
import Loader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import SummaryCard from '../../ui/summaryCard';
import FeeReportPanel from './feeReportPanel';
import AIReportPanel from './AIReportPanel';
import { generateCashflowReportWithAI, generateFeeReportWithAI } from '../../../db/firebaseConfig';

const YearlyReport = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [summaryData, setSummaryData] = useState({
        levyTxnIn: { usd: 0, zwg: 0 },
        levyTxnOut: { usd: 0, zwg: 0 },
        tuitionTxnIn: { usd: 0, zwg: 0 },
        tuitionTxnOut: { usd: 0, zwg: 0 },
        levyPayments: { usd: 0, zwg: 0 },
        tuitionPayments: { usd: 0, zwg: 0 }
    });
    const [recoveries, setRecoveries] = useState({
        levyRecoveries: { usd: 0, zwg: 0 },
        tuitionRecoveries: { usd: 0, zwg: 0 },
    });
    const [prepayments, setPrepayments] = useState({
        levyPrepayments: { usd: 0, zwg: 0 },
        tuitionPrepayments: { usd: 0, zwg: 0 },
    });
    const [loading, setLoading] = useState(true);
    const [feePayments, setFeePayments] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);

    const { currentTheme } = useTheme();
    const { addToast } = useToast();

    useEffect(() => {
        fetchAll(selectedYear);
        // eslint-disable-next-line
    }, [selectedYear]);

    const fetchAll = async (year) => {
        setLoading(true);
        try {
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;
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
            addToast('Error fetching yearly data.', 'error');
            setLoading(false);
        }
    };

    // Adapter for AIReportPanel (cashflow)
    const handleGenerateCashflowReport = async ({ periodLabel, data }) => {
        const { incoming, outgoing } = data;
        const result = await generateCashflowReportWithAI({ periodLabel, periodType: 'year', incoming, outgoing });
        if (result && result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            return { summary: result.candidates[0].content.parts[0].text };
        }
        return result;
    };
    // Adapter for FeeReportPanel
    const handleGenerateFeeReport = async ({ periodLabel, data }) => {
        const result = await generateFeeReportWithAI({ periodLabel, periodType: 'year', feePayments: data });
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
                    type="number"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                    style={{
                        background: currentTheme.background?.paper,
                        color: currentTheme.text?.primary,
                        borderColor: currentTheme.divider
                    }}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeeReportPanel selectedDate={selectedYear} feePayments={feePayments} generateReport={handleGenerateFeeReport} />
                <AIReportPanel
                    title="Cashflow Report"
                    prompt="Summarize the cashflow for the selected year."
                    data={{ incoming, outgoing }}
                    periodLabel={selectedYear}
                    generateReport={handleGenerateCashflowReport}
                    description="AI-generated summary of all incoming and outgoing bank transactions for the selected year."
                />
            </div>
        </div>
    );
};

export default YearlyReport;