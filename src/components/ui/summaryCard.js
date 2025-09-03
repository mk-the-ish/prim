import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const SummaryCard = ({ title, icon, children, bgColor }) => {
  const { currentTheme } = useTheme();

  const background = bgColor
    ? bgColor
    : currentTheme.background?.secondary || 'bg-blue-100';

  const titleColor = currentTheme.text?.secondary || '#64748b';

  return (
    <div
      className={`rounded-lg shadow-md p-3`}
      style={{ background: background }}
    >
      <div className="flex items-center">
        {icon && <div className="h-8 w-8 mr-3">{icon}</div>}
        <div>
          <h3 className="text-xs font-semibold" style={{ color: titleColor }}>
            {title}
          </h3>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
