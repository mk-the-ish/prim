import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ReportCard = ({ title, data, variant = 'default' }) => {
  const { currentTheme } = useTheme();

  const variants = {
    default: {
      background: currentTheme.background?.paper || '#e0e7ff',
      border: `1.5px solid ${currentTheme.primary?.main || '#2563eb'}`,
      title: currentTheme.primary?.main || '#2563eb',
      text: currentTheme.text?.primary || '#1e293b'
    },
    secondary: {
      background: currentTheme.background?.secondary || '#f0f9ff',
      border: `1.5px solid ${currentTheme.primary?.light || '#60a5fa'}`,
      title: currentTheme.primary?.light || '#60a5fa',
      text: currentTheme.text?.primary || '#1e293b'
    }
  };

  const style = variants[variant] || variants.default;

  return (
    <div
      className="p-6 rounded-lg shadow-lg border"
      style={{
        background: style.background,
        border: style.border
      }}
    >
      <h3
        className="text-xl font-bold mb-4"
        style={{ color: style.title }}
      >
        {title}
      </h3>
      <div className="mt-4">
        {Object.entries(data).map(([currency, amount]) => (
          <p key={currency} className="text-lg" style={{ color: style.text }}>
            {currency.toUpperCase()}: ${Number(amount).toFixed(2)}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ReportCard;
