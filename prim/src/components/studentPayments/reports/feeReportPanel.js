import React from 'react';
import AIReportPanel from './AIReportPanel';

const FeeReportPanel = ({ selectedDate, feePayments, generateReport }) => {
  return (
    <AIReportPanel
      title="Fee Payments Report"
      prompt="Summarize the fee payments for the selected period."
      data={feePayments}
      periodLabel={selectedDate}
      generateReport={generateReport}
      description="AI-generated summary of all fee payments for the selected period."
    />
  );
};

export default FeeReportPanel;
