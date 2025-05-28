import React from "react";

const TreeNode = ({ user }) => {
  return (
    <div className="ml-4 border-l-2 pl-4">
      <div className="font-semibold">{user.name}</div>
      <div className="text-sm text-gray-600">{user.email}</div>
      <div className="text-sm text-gray-600">
        Code: {user.referralCode}<span className="ml-4">Level: {user.currentLevel}</span></div>
      {user.matrixChildren?.length > 0 && (
        <div className="mt-2">
          {user.matrixChildren.map((child) => (
            <TreeNode key={child._id} user={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
