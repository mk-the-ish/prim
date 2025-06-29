import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUserGraduate, FaMoneyBill, FaDonate, FaChartBar, FaFileInvoiceDollar,
  FaWallet, FaCreditCard, FaPager
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const navLinks = [
  { to: '/dashboard', icon: <FaPager />, label: 'Dashboard' },
  { to: '/students', icon: <FaUserGraduate />, label: 'Students' },
  { to: '/fees', icon: <FaMoneyBill />, label: 'Fees' },
  { to: '/commission', icon: <FaDonate />, label: 'Commission' },
  { to: '/reports', icon: <FaChartBar />, label: 'Reports' },
];

const bottomLinks = [
  { to: '/transactions', icon: <FaCreditCard />, label: 'Transactions' },
  { to: '/financials', icon: <FaFileInvoiceDollar />, label: 'Financials' },
];

// Sidebar-specific button (not the main Button component)
const SidebarButton = ({
  active,
  onClick,
  children,
  className = '',
  expanded,
  ...props
}) => {
  const { currentTheme } = useTheme();
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full justify-start text-sm px-2 py-2 rounded
        transition-colors duration-200
        ${expanded ? 'pl-2' : 'justify-center'}
        ${active ? 'font-bold ring-2 ring-offset-2' : ''}
        ${className}
      `}
      style={{
        background: active
          ? currentTheme.primary?.main || '#2563eb'
          : currentTheme.background?.sidebar || '#1f2937',
        color: active
          ? currentTheme.primary?.contrastText || '#fff'
          : currentTheme.text?.sidebar || '#fff',
        border: 'none',
        outline: 'none'
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const Sidebar = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarExpanded((v) => !v);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 flex flex-col justify-between fixed h-full`}
        style={{
          background: currentTheme.background?.sidebar || '#1f2937',
          color: currentTheme.text?.sidebar || '#fff',
          width: isSidebarExpanded ? 256 : 80 // 64 or 20 in tailwind
        }}
      >
        {/* Top Section */}
        <div>
          <button
            onClick={toggleSidebar}
            className="w-full p-4 focus:outline-none hover:opacity-80 justify-center items-center"
            style={{ background: 'transparent' }}
          >
            <img
              src={`/images/${isSidebarExpanded ? 'prim.png' : 'favicon.png'}`}
              alt={isSidebarExpanded ? 'Retract' : 'Expand'}
              className="h-8 w-auto transition-all duration-300"
            />
          </button>
          <nav className="mt-4">
            <ul>
              {navLinks.map(({ to, icon, label }) => (
                <li key={to} className="flex items-center p-2">
                  <SidebarButton
                    onClick={() => navigate(to)}
                    active={location.pathname === to}
                    expanded={isSidebarExpanded}
                  >
                    <span className="text-xl">{icon}</span>
                    {isSidebarExpanded && <span className="ml-4">{label}</span>}
                  </SidebarButton>
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
                  <SidebarButton
                    onClick={() => navigate(to)}
                    active={location.pathname === to}
                    expanded={isSidebarExpanded}
                  >
                    <span className="text-lg">{icon}</span>
                    {isSidebarExpanded && <span className="ml-4">{label}</span>}
                  </SidebarButton>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-6 transition-all duration-300 overflow-y-auto`}
        style={{
          background: currentTheme.background?.default || '#f3f4f6',
          marginLeft: isSidebarExpanded ? 256 : 80
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar;