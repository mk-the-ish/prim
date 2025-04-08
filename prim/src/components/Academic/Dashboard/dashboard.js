import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
            <div className="grid grid-cols-2 gap-6">
                {/* Bulk invoice printing */}
                <div
                    onClick={() => navigate('/bulk-invoicing')}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                    <h2 className="text-xl font-semibold mb-2">Bulk Invoicing</h2>
                    <p className="text-gray-500 text-sm text-center">Print Invoices for multiple students</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;