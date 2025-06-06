import React, { useState } from 'react';
import axios from 'axios';

// Keep your levels config here locally (frontend controlled)
const LEVELS = {
  1: { amount: 300, upgradeCost: 500 },
  2: { amount: 500, upgradeCost: 1000 },
  3: { amount: 1000, upgradeCost: 2000 },
  4: { amount: 2000, upgradeCost: 4000 },
  5: { amount: 4000, upgradeCost: 8000 },
  6: { amount: 8000, upgradeCost: 16000 },
  7: { amount: 16000, upgradeCost: 32000 },
  8: { amount: 32000, upgradeCost: 64000 },
  9: { amount: 64000, upgradeCost: 128000 },
  10: { amount: 128000, upgradeCost: 256000 },
  11: { amount: 256000, upgradeCost: 512000 },
};

const UpgradePage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const token = localStorage.getItem("token");
  console.log("toen", token)
  const nextLevel = user.currentLevel + 1;
  const nextLevelData = LEVELS[nextLevel];

  const handleUpgrade = async () => {

    if (!nextLevelData) {
      setErrorMsg("No further levels available.");
      return;
    }

    if (user.walletBalance < nextLevelData.amount) {
      setErrorMsg(`Insufficient balance. Upgrade requires ₹${nextLevelData.amount}`);
      return;
    }

    setLoading(true);
    setResponseMsg(null);
    setErrorMsg(null);

    try {
      const response = await axios.post('http://localhost:4001/api/v1/upgrade', 
         {
          userId: user._id,
          level: nextLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      setResponseMsg(response.data.message);
    } catch (error) {
      const err = error.response?.data?.message || "An unexpected error occurred.";
      setErrorMsg(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upgrade to Level  {nextLevel}</h2>

      {nextLevelData ? (
        <>
          <p className="text-gray-600 mb-2">Upgrade amount: ₹{nextLevelData.amount}</p>
          <p className="text-gray-600 mb-4">Your current wallet balance: ₹{user.walletBalance}</p>

          {loading ? (
            <p className="text-blue-500">Processing upgrade...</p>
          ) : (
            <button
              onClick={handleUpgrade}
              className="bg-blue-600 hover:scale-95 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            // disabled={user.walletBalance < nextLevelData.amount}
            >
              Confirm Upgrade
            </button>
          )}

          {responseMsg && <p className="text-green-600 mt-4">{responseMsg}</p>}
          {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
        </>
      ) : (
        <p className="text-gray-600">You have reached the max level.</p>
      )}
    </div>
  );
};

export default UpgradePage;
