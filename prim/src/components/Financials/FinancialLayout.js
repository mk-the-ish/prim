import React from 'react';
import TopBar from './financials';
import { Outlet } from 'react-router-dom';

const TxnLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* Fixed Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <TopBar />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto mt-[80px] p-6 bg-gray-100">
                <Outlet />
            </div>
        </div>
    );
};

export default TxnLayout;