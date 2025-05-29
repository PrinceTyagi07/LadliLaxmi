import React from "react";
import TreeNode from "./TreeNode";

const Dashboard = ({ user }) => {
  return (
    <div className="p-6 bg-white text-black shadow-lg rounded-lg mt-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Matrix Network
      </h2>

      <div className="bg-blue-100 p-4 rounded-md shadow text-center mb-4">
        <div className="font-semibold text-lg">{user.name}</div>
        <div className="text-sm text-gray-600">{user.email}</div>
        <div className="text-sm text-gray-600">
          Code: {user.referralCode} 
          <span className="ml-4">Level: {user.currentLevel}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
       
        {user.matrixChildren?.length > 0 ? (
          user.matrixChildren.map((child, index) => (
            <TreeNode key={child._id || index} user={child} />
          ))
        ) : (
          <div className="text-gray-500 text-center">No matrix members found.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
