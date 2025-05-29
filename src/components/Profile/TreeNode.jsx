import React from "react";
import TreeGraph from "./TreeGraph";

const TreeNode = ({ user }) => {
 console.log(user)
  return (
    <div className="p-4 w-[80vw]">
      {/* <h1 className="text-2xl font-bold mb-4">Referral Matrix Tree</h1> */}
     
      <TreeGraph rootUser={user} />
    </div>
  );
};

export default TreeNode;
