// Main.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import DashboardOverview from "./DashboardOverview";
import Donation from "./Donation";
import TransactionHistory from "./TransactionHistory";
import { useLocation } from "react-router-dom";


const Main = ({user}) => {
  return (
    <div className="flex mx-auto flex-col ">
      <Routes>
        <Route path="/dashboardOverview" element={<DashboardOverview user={user} />} />
        <Route path="/downline" element={<Dashboard user={user} matrixChildren={user.matrixChildren} />} />
        {/* <Route path="/upgrade/:level" element={<Dashboard user={user} matrixChildren={user.matrixChildren} />} /> */}
        <Route path="/donation" element={<Donation user={user} matrixChildren={user.matrixChildren} />} />
        <Route path="/transactions" element={<TransactionHistory walletTransactions={user.walletTransactions} />} />
      </Routes>

    </div>
  );
};

export default Main;
