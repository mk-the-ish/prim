import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            console.log("User signed out successfully");
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div>
            <h1>Welcome to the Landing Page</h1>
            <p>This is the landing page after a successful login.</p>
            <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                Logout
            </button>
        </div>
    );
};

export default LandingPage;