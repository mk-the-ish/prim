import React, { useContext, createContext, useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";

const SidebarContext = createContext();

export default function Layout({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="https://img.logoipsum.com/243.svg"
              className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"
                }`}
              alt="Logo"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">
              <SidebarItem
                icon={<span className="material-icons">dashboard</span>}
                text="Dashboard"
                to="/landing"
              />
              <SidebarItem
                icon={<span className="material-icons">people</span>}
                text="Students"
                to="/students"
              />
              <SidebarItem
                icon={<span className="material-icons">attach_money</span>}
                text="Levy"
                to="/levy"
              />
              <SidebarItem
                icon={<span className="material-icons">school</span>}
                text="Tuition"
                to="/tuition"
              />
              <SidebarItem
                icon={<span className="material-icons">add</span>}
                text="Add Student"
                to="/new-student"
              />
              <SidebarItem
                icon={<span className="material-icons">report</span>}
                text="Reports"
                to="/reports"
              />
            </ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3">
            <img
              src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
              alt="User Avatar"
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
                }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">John Doe</h4>
                <span className="text-xs text-gray-600">johndoe@gmail.com</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="border rounded p-2 mr-4"
            />
          </div>
          <div className="flex items-center">
            <Link to="/landing" className="mr-4">
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
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-2"
              />
              <span>Simon Mkaro</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          <div className="bg-white rounded p-4 border border-gray-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, to }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${expanded ? "hover:bg-indigo-50 text-gray-600" : "text-gray-600"
        }`}
    >
      <Link to={to} className="flex items-center w-full">
        {icon}
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
            }`}
        >
          {text}
        </span>
      </Link>
    </li>
  );
}