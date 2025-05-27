// Dashboard.jsx
import React from "react";

const TreeNode = ({ user, level = 0 }) => {
  return (
    <div className={`ml-${level * 4} mb-4`}>
      <div className="bg-blue-100 p-2 rounded-md shadow-md text-center">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-gray-600">{user.email}</div>
      </div>
      {user.matrixChildren?.length > 0 && (
        <div className="flex justify-center mt-2 space-x-4 flex-wrap">
          {user.matrixChildren.map((child, idx) => (
            <TreeNode key={idx} user={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ matrixChildren }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Matrix Network
      </h2>
      <div className="flex justify-center flex-wrap">
        {matrixChildren?.length > 0 ? (
          matrixChildren.map((child, idx) => (
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
