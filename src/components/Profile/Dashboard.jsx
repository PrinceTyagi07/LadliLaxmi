import React from "react";

// Level colors
const levelColors = [
  "bg-blue-100 border-blue-500",
  "bg-green-100 border-green-500",
  "bg-yellow-100 border-yellow-500",
  "bg-purple-100 border-purple-500",
  "bg-pink-100 border-pink-500",
  "bg-indigo-100 border-indigo-500",
];

const TreeNode = ({ user, isLast = false, parentHasSiblings = false }) => {
  const currentLevel = user.currentLevel || 0;
  const bgColor = levelColors[Math.min(currentLevel, levelColors.length - 1)];

  return (
    <div className="flex flex-col items-center relative min-w-[10rem]">
      {/* Connector from top */}
      {currentLevel > 0 && (
        <div className="absolute top-0 h-6 w-0.5 bg-gray-400"></div>
      )}

      {/* Node */}
      <div className={`${bgColor} p-3 rounded-lg border-2 text-center mb-2 w-40 sm:w-48 shadow-sm border-red-400`}>
        <div className="font-bold truncate">{user.name}</div>
        <div className="text-xs">ID: {user.referralCode || user._id || "N/A"}</div>
        <div className="text-sm">Level: {currentLevel}</div>
      </div>

      {/* Children */}
      {user.matrixChildren?.length > 0 && (
        <div className="relative flex justify-center w-full overflow-x-auto">
          {/* Horizontal connector */}
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            <div className="h-0.5 bg-gray-400 w-full max-w-[90vw] sm:max-w-[80vw] mx-auto"></div>
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-6 pt-6 px-4">
            {user.matrixChildren.map((child, index) => (
              <React.Fragment key={child._id || index}>
                {/* Vertical line to each child */}
                <div
                  className="absolute top-0 h-6 w-0.5 bg-gray-400 border-amber-300 border-2"
                  style={{
                    left: `${(index + 0.5) * (100 / user.matrixChildren.length)}%`,
                    transform: "translateX(-50%)",
                  }}
                ></div>

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

const MemoizedTreeNode = React.memo(TreeNode);

const Dashboard = ({ user }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white text-black shadow-lg rounded-lg mt-8 overflow-x-auto w-full max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-700">
        Matrix Network
      </h2>

      <div className="bg-blue-100 mx-auto border-red-600 border-2 w-fit p-4 rounded-md shadow text-center mb-6">
        <div className="font-semibold text-base sm:text-lg">{user.name}</div>
        <div className="text-xs sm:text-sm text-gray-600">{user.email}</div>
        <div className="text-xs sm:text-sm text-gray-600">
          Code: {user.referralCode}
          <span className="ml-4">Level: {user.currentLevel}</span>
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto px-2">
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
