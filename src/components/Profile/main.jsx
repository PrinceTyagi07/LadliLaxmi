// Main.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import DashboardOverview from "./DashboardOverview";


const Main = ({user}) => {
  return (
    <div className="flex mr-4  flex-col ">
      
      <Routes>
        <Route path="/dashboardOverview" element={<DashboardOverview user={user} />} />
        <Route path="/downline" element={<Dashboard matrixChildren={user.matrixChildren} />} />
       
      </Routes>
      {/* <DashboardOverview user={user} />
      <Dashboard matrixChildren={user.matrixChildren} /> */}

    </div>
  );
};

export default Main;
