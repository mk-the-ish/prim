import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({
    title,
    children,
    className = '',
    headerAction,
    variant = 'default'
}) => {
    const { currentTheme } = useTheme();

    // Use theme colors for background
    const variants = {
        default: currentTheme.background?.paper || 'bg-white',
        secondary: currentTheme.background?.secondary || 'bg-blue-50',
        primary: currentTheme.background?.primary || 'bg-gray-50'
    };

    return (
        <div
            className={`rounded-lg shadow-md overflow-hidden ${className}`}
            style={{ background: variants[variant] }}
        >
            {title && (
                <div className="px-6 py-3 flex justify-between items-center">
                    <h3
                        className="text-2xl font-bold"
                        style={{ color: currentTheme.text?.primary }}
                    >
                        {title}
                    </h3>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="p-2">
                {children}
            </div>
        </div>
    );
};

export default Card;
