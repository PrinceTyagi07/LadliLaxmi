import { useState } from "react";
import WithdrawApproval from "../Components/WithdrawApproval";

const Withdraws = () => {
  // Dummy withdrawal requests data
  const [requests, setRequests] = useState([
    {
      _id: "w1",
      user: "Mukesh Kumar",
      amount: 5000,
      bankName: "State Bank of India",
      accountNumber: "1234567890",
      ifsc: "SBIN0001234",
      status: "Pending",
    },
    {
      _id: "w2",
      user: "Anita Sharma",
      amount: 3000,
      bankName: "HDFC Bank",
      accountNumber: "9876543210",
      ifsc: "HDFC0005678",
      status: "Pending",
    },
    {
      _id: "w3",
      user: "Rahul Verma",
      amount: 4500,
      bankName: "ICICI Bank",
      accountNumber: "1122334455",
      ifsc: "ICIC0009988",
      status: "Pending",
    },
  ]);

  // Approve handler (just update status locally here)
  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req._id === id ? { ...req, status: "Approved" } : req
      )
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Withdraw Requests</h2>
      <WithdrawApproval requests={requests} onApprove={handleApprove} />
    </div>
  );
};

export default Withdraws;
