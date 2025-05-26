import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorised = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-white to-purple-100">
            <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Access Denied
                </h2>
                <p className="text-gray-600 mb-6">
                    You don't have the required permissions to access this page.
                    Please contact your administrator for assistance.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorised;