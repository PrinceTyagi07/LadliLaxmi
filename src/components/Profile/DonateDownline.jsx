import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Assuming you use react-toastify for notifications

const DonateDownline = ({ user }) => {
  const [recipientReferralCode, setRecipientReferralCode] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const token = localStorage.getItem("token"); // Get token from localStorage

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setIsLoading(true);

    if (!recipientReferralCode || !amount) {
      setMessage("Please enter both referral code and amount.");
      setMessageType("error");
      toast.error("Please enter both referral code and amount.");
      setIsLoading(false);
      return;
    }

    const transferAmount = Number(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      setMessage("Please enter a valid positive amount.");
      setMessageType("error");
      toast.error("Please enter a valid positive amount.");
      setIsLoading(false);
      return;
    }

    // Basic client-side check against user's wallet balance
    if (user && user.walletBalance < transferAmount) {
      setMessage(`Insufficient wallet balance. You have ₹${user.walletBalance.toFixed(2)} available.`);
      setMessageType("error");
      toast.error(`Insufficient wallet balance. You have ₹${user.walletBalance.toFixed(2)} available.`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4001/api/v1/donations/transfer-to-downline", // Your backend endpoint
        { recipientReferralCode, amount: transferAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      setMessageType("success");
      toast.success(response.data.message);
      setRecipientReferralCode(""); // Clear form fields on success
      setAmount("");
      // Optionally, you might want to trigger a user data refetch here
      // if your user context/state doesn't automatically update on balance changes.
      // E.g., user.fetchUserData(); if it's passed as a prop
    } catch (error) {
      console.error("Fund transfer failed:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to transfer funds. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center sm:p-4 items-start lg:p-2">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6">
          Transfer Funds to Downline
        </h2>

        {/* Current Wallet Balance Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
          <p className="flex justify-between items-center font-bold text-base">
            <span>Your Current Wallet Balance:</span>
            <span>₹{user?.walletBalance?.toFixed(2) || "0.00"}</span>
          </p>
        </div>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label
              htmlFor="recipientReferralCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Downline User's Referral Code
            </label>
            <input
              type="text"
              id="recipientReferralCode"
              name="recipientReferralCode"
              value={recipientReferralCode}
              onChange={(e) => setRecipientReferralCode(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500"
              placeholder="e.g., ABC123DEF"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Transfer (₹)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-500 no-spinner"
              placeholder="e.g., 500.00"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Transfer Funds"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-3 rounded-md text-sm font-medium text-center ${
              messageType === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonateDownline;