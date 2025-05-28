import React from 'react'

const TreeNode = ({ user, level = 0 }) => {
  
  console.log('treechild',user)
  return (
    <div className={`ml-${level * 4} mb-4 `}>
      <div className="bg-blue-100 p-2 text-black rounded-md shadow-md text-center">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm">{user.email}</div>
        <div className="text-sm">{user.referralCode}  <span className=" px-4"> Level- {user.currentLevel}</span></div>
      </div>
      {user.matrixChildren?.length >0 && (
        <div className="flex justify-center mt-2 space-x-4 flex-wrap">
          {user.matrixChildren.map((child, idx) => (
            <TreeNode key={idx} user={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode