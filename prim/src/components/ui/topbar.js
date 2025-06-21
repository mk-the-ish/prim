import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const TopBar = ({ title, userName }) => {
    return (
        <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
            <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                <FaUserCircle className="text-lg" /> 
                <span className="ml-4">{userName || 'Profile'}</span>
            </Link>
            <h1 className="text-2xl font-bold text-center flex-1">{title}</h1>
        </div>
    );
};

export default TopBar;
