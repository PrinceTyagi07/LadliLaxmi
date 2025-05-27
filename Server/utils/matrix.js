const User = require("../models/User");
// BFS to find available matrix slot
const findMatrixSlot = async (referrerCode) => {
  const queue = [];
  const referrer = await User.findOne({ referralCode: referrerCode });
  if (!referrer) return null;

  queue.push(referrer);

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.matrixChildren.length < 2) {
      return current;
    }
    //if current user have less then 2 childs 
    // Load full children info from DB
    for (let childId of current.matrixChildren){
      const child = await User.findById(childId);
      if (child) queue.push(child);
    }
  }
  return null; // No available slot found
};
module.exports = { findMatrixSlot };