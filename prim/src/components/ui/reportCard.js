import React from 'react';

const ReportCard = ({ title, data, variant = 'default' }) => {
  const variants = {
    default: 'bg-blue-100 border-blue-300',
    secondary: 'bg-blue-150 border-blue-400',
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg border ${variants[variant]}`}>
      <h3 className="text-xl font-bold mb-4 text-blue-600">{title}</h3>
      <div className="mt-4">
        {Object.entries(data).map(([currency, amount]) => (
          <p key={currency} className="text-lg">
            {currency.toUpperCase()}: ${Number(amount).toFixed(2)}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ReportCard;
