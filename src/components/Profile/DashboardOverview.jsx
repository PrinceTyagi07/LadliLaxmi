import React from "react";
import { ClipboardCopy } from "lucide-react";

// Define color classes for Tailwind safety
const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    value: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    value: "text-green-600",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    value: "text-amber-600",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    value: "text-red-600",
  },
};

const InfoCard = ({ title, value, color }) => {
  const { bg, text, value: valueColor } = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`p-6 rounded-lg shadow-md text-center ${bg}`}>
      <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${text}`}>{title}</h3>
      <p className={`text-3xl sm:text-4xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
};

const DashboardOverview = ({ user }) => {
  if (!user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode);
    alert("Referral code copied to clipboard!");
  };

  const overviewData = [
    { title: "Current Level", value: user.currentLevel ?? 0, color: "blue" },
    { title: "Wallet Balance", value: `₹${(user.walletBalance ?? 0).toFixed(2)}`, color: "green" },
    { title: "Direct Referrals", value: user.directReferrals?.length ?? 0, color: "blue" },
    { title: "Matrix Members", value: user.matrixChildren?.length ?? 0, color: "green" },
    { title: "Total Donations Received", value: user.totalDonationsReceived ?? 0, color: "amber" },
    { title: "Total Donations Sent", value: user.totalDonationsSent ?? 0, color: "red" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-white rounded-2xl shadow-xl w-full max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
        Welcome, {user.name?.split(" ")[0] || "User"}
      </h2>
      <p className="text-gray-600 text-sm sm:text-base mb-4">{user.email}</p>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-lg text-sm sm:text-base">
          Referral Code: <span className="font-bold">{user.referralCode}</span>
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <ClipboardCopy size={16} /> Copy
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
        {overviewData.map((item, idx) => (
          <InfoCard
            key={idx}
            title={item.title}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>

      <div className="p-4 sm:p-6 bg-gray-50 rounded-xl shadow-md">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
          Recent Activity
        </h3>
        <p className="text-gray-500 italic">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default DashboardOverview;
