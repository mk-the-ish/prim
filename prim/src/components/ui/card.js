import React from 'react';

const Card = ({ 
    title, 
    children, 
    className = '',
    headerAction,
    variant = 'default'
}) => {
    const variants = {
        default: 'bg-white',
        secondary: 'bg-blue-50',
        primary: 'bg-gray-50'
    };

    return (
        <div className={`rounded-lg shadow-md overflow-hidden ${variants[variant]} ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-700">{title}</h3>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
