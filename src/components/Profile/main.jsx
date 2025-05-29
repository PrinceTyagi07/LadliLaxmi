import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import DashboardOverview from "./DashboardOverview";
import Donation from "./Donation";
import TransactionHistory from "./TransactionHistory";
import MyTeam from "./MyTeam";

const Main = ({ user }) => {
  return (
    <div className="flex flex-col items-center my-6 md:my-10 mx-auto w-full border h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
      <Routes>
        <Route
          path="/"
          element={
            <div className="text-center text-white p-6 sm:p-8">
              <strong className="text-lg sm:text-xl md:text-2xl">
                Hii, Welcome Back
                <br />
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-amber-400 mt-2">
                  {user.name}
                </h1>
                <br />
              </strong>
              <p className="text-xl sm:text-2xl">Check Out your Dashboard</p>
              <h2 className="text-4xl sm:text-5xl mt-4">👈</h2>
            </div>
          }
        />
        <Route
          path="/dashboardOverview"
          element={<DashboardOverview user={user} />}
        />
        <Route
          path="/downline"
          element={<Dashboard user={user} matrixChildren={user.matrixChildren} />}
        />
        <Route
          path="/myteam"
          element={<MyTeam team={user} matrixChildren={user.matrixChildren} />}
        />
        <Route
          path="/donation"
          element={<Donation user={user} matrixChildren={user.matrixChildren} />}
        />
        <Route
          path="/transactions"
          element={<TransactionHistory walletTransactions={user.walletTransactions} />}
        />
      </Routes>
    </div>
  );
};

export default Main;
