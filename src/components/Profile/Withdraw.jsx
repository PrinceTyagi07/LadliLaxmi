import React, { useEffect, useState } from "react";
import axios from "axios";

const Withdraw = ({ user }) => {
  const [bankDetails, setBankDetails] = useState(null);
  const [formData, setFormData] = useState({
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    amount: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.bankDetails) {
      setBankDetails(user.bankDetails);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      return setMessage("Enter a valid amount");
    }

    try {
      const payload = {
        amount: formData.amount,
        ...(bankDetails
          ? {}
          : {
              bankDetails: {
                accountHolder: formData.accountHolder,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
                bankName: formData.bankName,
              },
            }),
      };

      await axios.post(
        "http://localhost:4001/api/v1/withdraw/request",
        // "http://localhost:4001/api/v1/withdraw/request/${userId}",
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // or however you store token
          },
        }
      );

      setMessage("Withdraw request sent successfully");
    } catch (err) {
      console.error(err);
      setMessage("Error sending withdraw request");
    }
  };

  return (
    <div className="w-2/3 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 text-gray-900">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Withdraw Funds
        </h2>

        <p className="mb-6 text-base sm:text-lg text-gray-700">
          <strong>Wallet Balance:</strong> ₹
          {user?.walletBalance?.toFixed(2) || "0.00"}
        </p>

        <form onSubmit={handleWithdraw} className="space-y-5">
          {!bankDetails && (
            <>
              <div>
                <label className="block font-medium text-sm sm:text-base mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-sm sm:text-base mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-sm sm:text-base mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-sm sm:text-base mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-medium text-sm sm:text-base mb-1">
              Withdraw Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min={1}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-300"
          >
            Submit Withdraw Request
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center text-sm font-medium text-green-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
