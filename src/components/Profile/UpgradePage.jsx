import React, { useState } from 'react';
import axios from 'axios';

const UpgradePage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const nextLevel = user.currentLevel + 1;
  const upgradeAmount = getUpgradeAmount(nextLevel);

  const handleUpgrade = async () => {
    setLoading(true);
    setResponseMsg(null);
    setErrorMsg(null);

    try {
      const response = await axios.post('http://localhost:4001/api/v1/upgrade', {
        userId: user._id,
        level: nextLevel,
        amount: upgradeAmount
      });

      setResponseMsg(response.data.message);
    } catch (error) {
      const err = error.response?.data?.message || "An unexpected error occurred.";
      setErrorMsg(err);
    } finally {
      setLoading(false);
    }
  };

  function getUpgradeAmount(level) {
    const levelPrices = { 1: 500, 2: 1000, 3: 2000 };
    return levelPrices[level] || 0;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow flex flex-col justify-center   ">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upgrade to Level {nextLevel}</h2>

      <p className="text-gray-600 mb-2">Upgrade amount: ₹{upgradeAmount}</p>
      <p className="text-gray-600 mb-4">Your current wallet balance: ₹{user.walletBalance}</p>

      {loading ? (
        <p className="text-blue-500">Processing upgrade...</p>
      ) : (
        <button
          onClick={handleUpgrade}
          className="bg-blue-600 hover:scale-95 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Confirm Upgrade
        </button>
      )}

      {responseMsg && <p className="text-green-600 mt-4">{responseMsg}</p>}
      {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
    </div>
  );
};

export default UpgradePage;
