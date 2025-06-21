import React from 'react';

const SummaryCard = ({ title, icon, children, bgColor = "bg-blue-100" }) => {
  return (
    <div className={`rounded-lg shadow-md p-3 ${bgColor}`}>
      <div className="flex items-center">
        {icon && <div className="h-8 w-8 mr-3">{icon}</div>}
        <div>
          <h3 className="text-xs font-semibold text-gray-600">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
