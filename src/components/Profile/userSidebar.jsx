import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logout from "../Auth/Logout";

const UserSidebar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <div className="md:hidden p-4  md:mt-0  bg-gray-800 text-white flex justify-between items-center">
        <h3 className="text-lg font-bold">Welcome, {user?.name}!</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar container */}
      <div
        className={`
          fixed top-10 lg:top-0 left-0 h-full bg-gray-800 text-gray-100 p-6 shadow-lg flex flex-col
          w-64 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          z-50
        `}
      >
        {/* User info (hidden on mobile because it's shown in the header) */}
        <div className="hidden md:block text-center mb-8 pb-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold mb-1 text-white">Welcome, {user?.name}!</h3>
          <p className="text-sm text-gray-400 mb-1">Level: {user?.currentLevel || 0}</p>
          <p className="text-xl font-semibold text-blue-400">Balance: ₹{user?.walletBalance?.toFixed(2) || '0.00'}</p>
        </div>

        <nav className="flex-grow  ">
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/userdashboard/dashboardOverview"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-colors duration-200 text-lg ${
                    isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>

            {user?.currentLevel === 0 && (
              <li>
                <NavLink
                  to="/userdashboard/donation"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition-colors duration-200 text-lg ${
                      isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  Activate Level 1
                </NavLink>
              </li>
            )}

            {user?.currentLevel > 0 && user?.currentLevel < 11 && (
              <li>
                <NavLink
                  to={`/userdashboard/upgrade/${user.currentLevel + 1}`}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition-colors duration-200 text-lg ${
                      isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  Upgrade to Level {user.currentLevel + 1}
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to="/userdashboard/downline"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-colors duration-200 text-lg ${
                    isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                My Downline
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/userdashboard/myteam"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-colors duration-200 text-lg ${
                    isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                My Team
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/userdashboard/transactions"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-colors duration-200 text-lg ${
                    isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                Transaction History
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="mt-6 border-t border-gray-700 pt-6 mx-auto">
          <Logout />
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default UserSidebar;
