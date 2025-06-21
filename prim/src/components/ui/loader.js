import React from 'react';

const SkeletonLoader = ({ type = 'text', count = 1, className = '' }) => {
    const basePulseStyles = "animate-pulse bg-gray-300 rounded-md";

    switch (type) {
        case 'text':
            return (
                <div className={`space-y-2 ${className}`}>
                    {Array.from({ length: count }).map((_, i) => (
                        <div
                            key={i}
                            className={`${basePulseStyles}`}
                            style={{ width: `${100 - (i * 10)}%`, height: '1rem' }}
                        ></div>
                    ))}
                </div>
            );
        case 'avatar':
            return (
                <div className={`rounded-full ${basePulseStyles} ${className}`} style={{ width: '4rem', height: '4rem' }}></div>
            );
        case 'card':
            return (
                <div className={`p-4 border border-gray-200 rounded-lg shadow-md ${basePulseStyles} ${className}`}>
                    <div className={`${basePulseStyles} h-6 w-3/4 mb-3`}></div> {/* Card Header */}
                    <div className={`${basePulseStyles} h-4 w-full mb-2`}></div> {/* Text Line 1 */}
                    <div className={`${basePulseStyles} h-4 w-5/6`}></div> {/* Text Line 2 */}
                </div>
            );
        case 'table-row':
            return (
                <tr className={`h-12 ${basePulseStyles} ${className}`}>
                    {Array.from({ length: count || 4 }).map((_, i) => ( 
                        <td key={i} className="px-6 py-4">
                            <div className={`${basePulseStyles} h-4 w-full`}></div>
                        </td>
                    ))}
                </tr>
            );
        default:
            return <div className={`${basePulseStyles} h-10 w-full ${className}`}></div>;
    }
};

export default SkeletonLoader;