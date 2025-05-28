// Dashboard.jsx
import React from "react";

import TreeNode from "./TreeNode";
const Dashboard = ({ user }) => {
  return (
    
    <div className="p-6 bg-white text-black shadow-lg rounded-lg mt-8">
     {console.log('dashboard user', user)}
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Matrix Network
      </h2>
      <div className="flex flex-col gap-4 justify-center flex-wrap">
        <div className="bg-blue-100 p-2 rounded-md shadow-md text-center">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-gray-600">{user.email}</div>
        <div className="text-sm text-gray-600">{user.referralCode} <span className=" px-4"> Level- {user.currentLevel}</span></div>
      </div>
        {user.matrixChildren?.length > 0 ? (
          user.matrixChildren.map((child, idx) => (
           
            <TreeNode key={idx} user={child} />

          ))
        ) : (
          <div className="text-gray-500 text-center">No members found.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
