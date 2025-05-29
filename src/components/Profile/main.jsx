// Main.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import DashboardOverview from "./DashboardOverview";
import Donation from "./Donation";
import TransactionHistory from "./TransactionHistory";
import  MyTeam from "./MyTeam"
const Main = ({ user }) => {
  return (

    <div className="flex items-center my-10 mx-auto w-[80%] px-5 flex-col ">

      <Routes>
        <Route
          path="/"
          element={
            <div className="text-center text-2xl text-white  p-8 ">
              <strong>
                {" "}
                Hii Welcome Back <br />
                <h1 className="text-amber-400 text-7xl">{user.name} </h1>
                <br />{" "}
              </strong>
              Check Out your Dashboard <br />
              <h2 className="text-6xl">👈</h2>
            </div>
          }
        />
        <Route
          path="/dashboardOverview"
          element={<DashboardOverview user={user} />}
        />
        <Route
          path="/downline"
          element={
            <Dashboard user={user} matrixChildren={user.matrixChildren} />
          }
        />
        <Route
          path="/myteam"
          element={
            <MyTeam team={user} matrixChildren={user.matrixChildren} />
          }
        />
        <Route
          path="/donation"
          element={
            <Donation user={user} matrixChildren={user.matrixChildren} />
          }
        />
        <Route
          path="/transactions"
          element={
            <TransactionHistory walletTransactions={user.walletTransactions} />
          }
        />
      </Routes>
    </div>
  );
};

export default Main;
