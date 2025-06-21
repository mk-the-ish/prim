import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUserGraduate, FaMoneyBill, FaDonate, FaChartBar, FaFileInvoiceDollar,
  FaWallet, FaCreditCard, FaPager, FaMoon, FaSun
} from 'react-icons/fa';
import Button from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';

const navLinks = [
  { to: '/dashboard', icon: <FaPager />, label: 'Dashboard' },
  { to: '/students', icon: <FaUserGraduate />, label: 'Students' },
  { to: '/levy', icon: <FaMoneyBill />, label: 'Levy' },
  { to: '/tuition', icon: <FaWallet />, label: 'Tuition' },
  { to: '/commission', icon: <FaDonate />, label: 'Commission' },
  { to: '/reports', icon: <FaChartBar />, label: 'Reports' },
];

const bottomLinks = [
  { to: '/transactions', icon: <FaCreditCard />, label: 'Transactions' },
  { to: '/financials', icon: <FaFileInvoiceDollar />, label: 'Financials' },
];

const Sidebar = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { themeName, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarExpanded((v) => !v);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white ${isSidebarExpanded ? 'w-64' : 'w-20'
          } transition-all duration-300 flex flex-col justify-between fixed h-full`}
      >
        {/* Top Section */}
        <div>
          <button
            onClick={toggleSidebar}
            className="w-full p-4 focus:outline-none hover:bg-gray-700 justify-center items-center"
          >
            <img
              src={`/images/${isSidebarExpanded ? 'prim.png' : 'favicon.png'}`}
              alt={isSidebarExpanded ? 'Retract' : 'Expand'}
              className="h-8 w-auto  transition-all duration-300"
            />
          </button>
          <nav className="mt-4">
            <ul>
              {navLinks.map(({ to, icon, label }) => (
                <li key={to} className="flex items-center p-2">
                  <Button
                    onClick={() => navigate(to)}
                    variant={location.pathname === to ? 'primary' : 'secondary'}
                    className={`flex items-center w-full justify-start ${isSidebarExpanded ? 'pl-2' : 'justify-center'} ${location.pathname === to ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  >
                    <span className="text-xl">{icon}</span>
                    {isSidebarExpanded && <span className="ml-4">{label}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mb-4">
          <nav>
            <ul>
              {bottomLinks.map(({ to, icon, label }) => (
                <li key={to} className="flex items-center p-2">
                  <Button
                    onClick={() => navigate(to)}
                    variant={location.pathname === to ? 'primary' : 'secondary'}
                    className={`flex items-center w-full justify-start text-sm ${isSidebarExpanded ? 'pl-2' : 'justify-center'} ${location.pathname === to ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  >
                    <span className="text-lg">{icon}</span>
                    {isSidebarExpanded && <span className="ml-4">{label}</span>}
                  </Button>
                </li>
              ))}
              {/* Theme Toggle Button */}
              <li className="flex items-center p-2 mt-2">
                <Button
                  onClick={toggleTheme}
                  variant="secondary"
                  className={`flex items-center w-full justify-start text-sm ${isSidebarExpanded ? 'pl-2' : 'justify-center'}`}
                >
                  <span className="text-lg">
                    {themeName === 'light' ? <FaMoon /> : <FaSun />}
                  </span>
                  {isSidebarExpanded && (
                    <span className="ml-4">
                      {themeName === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  )}
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 bg-gray-100 p-6 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'
          } overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}

export default Sidebar;