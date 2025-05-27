import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logout from "../"
const UserSidebar = ({ user, onLogout }) => {
  return (
    <div className="w-64 bg-gray-800 text-gray-100 p-6 shadow-lg flex flex-col min-h-full top-0 left-0">
      <div className="text-center mb-8 pb-6 border-b border-gray-700">
        <h3 className="text-2xl font-bold mb-1 text-white">Welcome, {user?.name}!</h3>
        <p className="text-sm text-gray-400 mb-1">Level: {user?.currentLevel || 0}</p>
        <p className="text-xl font-semibold text-blue-400">Balance: ₹{user?.walletBalance?.toFixed(2) || '0.00'}</p>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-3">
          <li>
            <NavLink
              to="/account/dashboardOverview"
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
                to="/account/dashboard"
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
                to={`/account/upgrade/${user.currentLevel + 1}`}
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
              to="/account/downline"
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
              to="/account/transactions"
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

      <div className="mt-auto pt-6 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
