import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaMoneyBill, FaBook, FaChartBar, FaUniversity, FaFileInvoiceDollar, FaWallet } from 'react-icons/fa'; // Example icons

const Layout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

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
            className="p-4 focus:outline-none hover:bg-gray-700"
          >
            {isSidebarExpanded ? 'Retract' : 'Expand'}
          </button>
          <nav className="mt-4">
            <ul>
              <li className="flex items-center p-4 hover:bg-gray-700">
                <Link to="/students" className="flex items-center">
                  <FaUserGraduate className="text-xl" />
                  {isSidebarExpanded && <span className="ml-4">Students</span>}
                </Link>
              </li>
              <li className="flex items-center p-4 hover:bg-gray-700">
                <Link to="/levy" className="flex items-center">
                  <FaMoneyBill className="text-xl" />
                  {isSidebarExpanded && <span className="ml-4">Levy</span>}
                </Link>
              </li>
              <li className="flex items-center p-4 hover:bg-gray-700">
                <Link to="/tuition" className="flex items-center">
                  <FaBook className="text-xl" />
                  {isSidebarExpanded && <span className="ml-4">Tuition</span>}
                </Link>
              </li>
              <li className="flex items-center p-4 hover:bg-gray-700">
                <Link to="/commission" className="flex items-center">
                  <FaChartBar className="text-xl" />
                  {isSidebarExpanded && <span className="ml-4">Commission</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mb-4">
          <nav>
            <ul>
              <li className="flex items-center p-4 hover:bg-gray-700 text-sm">
                <Link to="/levy_txn" className="flex items-center">
                  <FaUniversity className="text-lg" />
                  {isSidebarExpanded && <span className="ml-4">CBZ</span>}
                </Link>
              </li>
              <li className="flex items-center p-4 hover:bg-gray-700 text-sm">
                <Link to="/tuition_txn" className="flex items-center">
                  <FaFileInvoiceDollar className="text-lg" />
                  {isSidebarExpanded && <span className="ml-4">ZB</span>}
                </Link>
              </li>
              <li className="flex items-center p-4 hover:bg-gray-700 text-sm">
                <Link to="/financials" className="flex items-center">
                  <FaWallet className="text-lg" />
                  {isSidebarExpanded && <span className="ml-4">Financials</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 bg-gray-100 p-6 ml-${isSidebarExpanded ? '64' : '20'
          } overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;