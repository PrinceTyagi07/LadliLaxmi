import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";

// Convert flat users array to tree based on referralCode / referredBy
const buildReferralTree = (users, rootReferralCode) => {
  const userMap = new Map();
  users.forEach((user) => userMap.set(user.referralCode, { ...user, children: [] }));

  let root = null;

  users.forEach((user) => {
    const parent = userMap.get(user.referredBy);
    if (parent) {
      parent.children.push(userMap.get(user.referralCode));
    } else if (user.referralCode === rootReferralCode) {
      root = userMap.get(user.referralCode);
    }
  });

  return root;
};

const convertToTreeData = (user) => ({
  name: user.name,
  attributes: {
    Level: user.currentLevel,
    Email: user.email,
    referralCode: user.referralCode,
    referredBy: user.referredBy
  },
  children: user.children?.map(convertToTreeData) || [],
});

const TreeGraph = ({ users, rootReferralCode }) => {
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (treeContainer.current) {
      const { offsetWidth, offsetHeight } = treeContainer.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  if (!users || users.length === 0) return <div>No users data provided</div>;

  const rootUser = buildReferralTree(users, rootReferralCode);
  if (!rootUser) return <div>Root user not found</div>;

  const treeData = convertToTreeData(rootUser);

  return (
    <div
      ref={treeContainer}
      style={{ width: "100%", height: "100vh", border: "1px solid #ccc" }}
    >
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: dimensions.width / 2, y: 100 }}
        pathFunc="elbow"
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        nodeSvgShape={{
          shape: "circle",
          shapeProps: {
            r: 15,
            fill: "#4A90E2",
          },
        }}
        styles={{
          nodes: {
            node: {
              name: { fontSize: "14px", fill: "#fff" },
              attributes: { fontSize: "10px", fill: "#eee" },
            },
            leafNode: {
              name: { fontSize: "14px", fill: "#fff" },
              attributes: { fontSize: "10px", fill: "#ccc" },
            },
          },
        }}
      />
    </div>
  );
};

export default TreeGraph;
