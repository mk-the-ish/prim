import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Animated dots loader for a fresh look
const DotsLoader = ({ className = '', size = 12, color }) => {
    const dotStyle = {
        display: 'inline-block',
        width: size,
        height: size,
        margin: '0 4px',
        borderRadius: '50%',
        background: color,
        animation: 'dot-bounce 1.2s infinite both'
    };
    // Add keyframes only once
    if (typeof window !== 'undefined' && !document.getElementById('dot-bounce-keyframes')) {
        const style = document.createElement('style');
        style.id = 'dot-bounce-keyframes';
        style.innerHTML = `
            @keyframes dot-bounce {
                0%, 80%, 100% { transform: scale(0.7); opacity: 0.6; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <span style={{ ...dotStyle, animationDelay: '0s' }} />
            <span style={{ ...dotStyle, animationDelay: '0.2s' }} />
            <span style={{ ...dotStyle, animationDelay: '0.4s' }} />
        </div>
    );
};

const SkeletonLoader = ({ type = 'text', count = 1, className = '' }) => {
    const { currentTheme } = useTheme();

    // Use theme colors for skeletons
    const bgColor = currentTheme.skeleton?.background || 'rgba(209,213,219,0.5)';
    const dotColor = currentTheme.primary?.main || '#2563eb';

    switch (type) {
        case 'dots':
            return <DotsLoader className={className} color={dotColor} />;
        case 'text':
        case 'avatar':
        case 'card':
        case 'table-row':
            // For all other types, fallback to animated dots for consistency
            return (
                <div className={`py-8`}>
                    <DotsLoader className={className} color={dotColor} />
                </div>
            );
        default:
            return (
                <div className={`py-8`}>
                    <DotsLoader className={className} color={dotColor} />
                </div>
            );
    }
};

export default SkeletonLoader;