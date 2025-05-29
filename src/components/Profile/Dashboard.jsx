


import React from "react";

// Define level colors outside the component to avoid recreation
const levelColors = [
  "bg-blue-100 border-blue-500",  // Level 0
  "bg-green-100 border-green-500", // Level 1
  "bg-yellow-100 border-yellow-500", // Level 2
  "bg-purple-100 border-purple-500", // Level 3
  "bg-pink-100 border-pink-500", // Level 4
  "bg-indigo-100 border-indigo-500" // Level 5+
];

const TreeNode = ({ user, isLast = false, parentHasSiblings = false }) => {
  // Use user.currentLevel for coloring (fallback to 0 if undefined)
  const currentLevel = user.currentLevel || 0;
  const bgColor = levelColors[Math.min(currentLevel, levelColors.length - 1)];

  return (
    <div className="flex flex-col items-center relative">
      {/* Vertical connector line from parent */}
      {currentLevel > 0 && (
        <div className="absolute top-0 h-6 w-0.5 bg-gray-400"></div>
      )}

      {/* Node content */}
      <div className={`${bgColor} p-3 rounded-lg border-2 text-center mb-2 w-48 relative z-10 shadow-sm border-red-400 `}>
        <div className="font-bold truncate">{user.name}</div>
        <div className="text-xs">ID: {user.referralCode || user._id || "N/A"}</div>
        <div className="text-sm">Level: {currentLevel}</div>
      </div>

      {/* Children container */}
      {user.matrixChildren?.length > 0 && (
        <div className="relative flex justify-center  ">
          {/* Horizontal connector line */}
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            <div className="h-0.5 bg-gray-400 w-[40vw]" style={{ 
              // width: `${100 - (100 / (user.matrixChildren.length + 1))}%` 
              
            }}></div>
          </div>
          
          <div className="flex flex-row flex-wrap justify-center  gap-4 pt-6 ">
            {user.matrixChildren.map((child, index) => (
              <React.Fragment key={child._id || index}>
                {/* Vertical connector to each child */}
                <div className="absolute top-0 h-6 w-0.5 bg-gray-400 border-amber-300 border-2 " style={{
                  left: `${(index + 0.5) * (100 / user.matrixChildren.length)}%`,
                  transform: 'translateX(-50%)'
                }}></div>
                
                <TreeNode 
                  user={child} 
                  isLast={index === user.matrixChildren.length - 1}
                  parentHasSiblings={user.matrixChildren.length > 1}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Memoized version for better performance
const MemoizedTreeNode = React.memo(TreeNode);

const Dashboard = ({ user }) => {
  return (
    <div className="p-6 bg-white text-black shadow-lg rounded-lg mt-8 overflow-x-hidden w-[80vw] justify-center flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Matrix Network
      </h2>

      <div className="bg-blue-100 self-center border-red-600  border-2 w-fit p-4 rounded-md shadow text-center mb-4">
        <div className="font-semibold text-lg">{user.name}</div>
        <div className="text-sm text-gray-600">{user.email}</div>
        <div className="text-sm text-gray-600">
          Code: {user.referralCode}
          <span className="ml-4">Level: {user.currentLevel}</span>
        </div>
      </div>

      <div className="flex justify-center   gap-4">
        {user.matrixChildren?.length > 0 ? (
          user.matrixChildren.map((child, index) => (
            <TreeNode key={child._id || index} user={child} />
          ))
        ) : (
          <div className="text-gray-500 text-center py-12">Loading user data...</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;