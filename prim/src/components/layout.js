// Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
//import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="bg-gray-800 text-white w-64 flex flex-col">
                <div className="p-4">
                    <h1 className="text-xl font-semibold">Prim</h1> 
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link to='/landing' className="block p-2 rounded hover:bg-gray-700">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to='/students' className="block p-2 rounded hover:bg-gray-700">
                                Students
                            </Link>
                        </li>
                        <li>
                            <Link to='/levy' className="block p-2 rounded hover:bg-gray-700">
                                Levy
                            </Link>
                        </li>
                        <li>
                            <Link to='/tuition' className="block p-2 rounded hover:bg-gray-700">
                                Tuition
                            </Link>
                        </li>
                        <li>
                            <Link to='/landing' className="block p-2 rounded hover:bg-gray-700">
                                Commission
                            </Link>
                        </li>
                        <li>
                            <Link to='/landing' className="block p-2 rounded hover:bg-gray-700">
                                Payments
                            </Link>
                        </li>
                        <li>
                            <Link to='/landing' className="block p-2 rounded hover:bg-gray-700">
                                Reports
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <h2 className="text-sm font-semibold mb-2">Your teams</h2>
                    <ul className="space-y-1">
                        <li>
                            <Link to='landing' className="flex items-center p-1 rounded hover:bg-gray-700">
                                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                                    H
                                </div>
                                <span className="ml-2">Heroicons</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/landing' className="flex items-center p-1 rounded hover:bg-gray-700">
                                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                                    T
                                </div>
                                <span className="ml-2">Tailwind Labs</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/landing' className="flex items-center p-1 rounded hover:bg-gray-700">
                                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                                    W
                                </div>
                                <span className="ml-2">Workcation</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navigation */}
                <header className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search"
                            className="border rounded p-2 mr-4"
                        />
                    </div>
                    <div className="flex items-center">
                        <Link to='/landing' className="mr-4">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.158a2.033 2.033 0 01-1.595 1.437L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </Link>
                        <div className="flex items-center"> {/*this is all placeholder data*/}
                            <img
                                src="https://via.placeholder.com/40"
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full mr-2"
                            />
                            <span>Simon Mkaro</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-4 overflow-auto">
                    <div className="bg-white rounded p-4 border border-gray-200">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;