import React, { useState } from 'react';
import Loader from '../../ui/loader';
import Button from '../../ui/button';

/**
 * AIReportPanel - A reusable panel for generating and displaying AI reports
 * @param {Object} props
 * @param {string} title - Section title
 * @param {string} prompt - The prompt to send to the AI
 * @param {Array} data - The data to summarize (feePayments, cashflows, etc)
 * @param {string} periodLabel - Human readable period (e.g. "2025-06-28", "Term 2, 2025", "2025")
 * @param {function} generateReport - Async function to call AI (should return structured JSON)
 * @param {string} [description] - Optional description for the panel
 * @param {React.ReactNode} [children] - Optional extra UI (e.g. filters)
 */
const AIReportPanel = ({
  title,
  prompt,
  data,
  periodLabel,
  generateReport,
  description,
  children,
}) => {
  const [aiReport, setAiReport] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setAiLoading(true);
    setAiError('');
    setAiReport(null);
    setCopied(false);
    try {
      const result = await generateReport({ periodLabel, data, prompt });
      // Extract summary if Gemini SDK object is returned
      if (result && result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        setAiReport({ summary: result.candidates[0].content.parts[0].text });
      } else {
        setAiReport(result);
      }
    } catch (err) {
      setAiError('Failed to generate AI report.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownload = () => {
    if (!aiReport) return;
    const blob = new Blob([JSON.stringify(aiReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_ai_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(JSON.stringify(aiReport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          {description && <div className="text-gray-600 mb-2">{description}</div>}
          <div className="text-sm text-gray-500">{periodLabel}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleGenerate} disabled={aiLoading}>
            {aiLoading ? <Loader type="inline" /> : 'Generate AI Report'}
          </Button>
          {aiReport && (
            <>
              <Button variant="secondary" onClick={handleDownload}>Download JSON</Button>
              <Button variant="secondary" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy JSON'}</Button>
            </>
          )}
        </div>
      </div>
      {children}
      {aiError && <div className="text-red-500 mb-2">{aiError}</div>}
      {aiReport && (
        <div className="bg-gray-50 rounded p-4 mt-4">
          <h3 className="font-bold mb-2 text-lg">AI Generated Summary</h3>
          {aiReport.summary && <div className="mb-2"><strong>Summary:</strong> {aiReport.summary}</div>}
          {/* Render totals for both schemas */}
          {aiReport.totals && (
            <div className="mb-2">
              <strong>Totals:</strong>{' '}
              {typeof aiReport.totals.totalIn !== 'undefined' ? (
                <>
                  In: ${aiReport.totals.totalIn ?? 0}, Out: ${aiReport.totals.totalOut ?? 0}, Net: ${aiReport.totals.net ?? 0}
                </>
              ) : (
                <>USD ${aiReport.totals.usd ?? 0}, ZWG ${aiReport.totals.zwg ?? 0}</>
              )}
            </div>
          )}
          {/* Render byType for both schemas */}
          {aiReport.byType && (
            <>
              <div className="mb-2"><strong>By Type:</strong></div>
              <ul className="ml-4">
                {/* Cashflow schema: incoming/outgoing breakdown */}
                {aiReport.byType.incoming && aiReport.byType.outgoing ? (
                  <>
                    <li><strong>Incoming:</strong></li>
                    <ul className="ml-4">
                      {Object.entries(aiReport.byType.incoming).map(([bank, val]) => (
                        <li key={bank}>{bank[0].toUpperCase() + bank.slice(1)}: ${val ?? 0}</li>
                      ))}
                    </ul>
                    <li><strong>Outgoing:</strong></li>
                    <ul className="ml-4">
                      {Object.entries(aiReport.byType.outgoing).map(([bank, val]) => (
                        <li key={bank}>{bank[0].toUpperCase() + bank.slice(1)}: ${val ?? 0}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  // Daily/fee schema: tuition/levy breakdown
                  Object.entries(aiReport.byType).map(([type, vals]) => (
                    <li key={type}>{type[0].toUpperCase() + type.slice(1)}: USD ${vals.usd ?? 0}, ZWG ${vals.zwg ?? 0}</li>
                  ))
                )}
              </ul>
            </>
          )}
          {aiReport.notable && aiReport.notable.length > 0 && (
            <div className="mt-2">
              <strong>Notable:</strong>
              <ul className="ml-4">
                {aiReport.notable.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Show raw JSON for advanced users */}
          <details className="mt-4">
            <summary className="cursor-pointer text-blue-600">Show raw JSON</summary>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(aiReport, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default AIReportPanel;
