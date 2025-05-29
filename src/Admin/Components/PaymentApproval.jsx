export default function PaymentApproval({ payments, onApprove, onReject }) {
  if (!payments || payments.length === 0) {
    return <p className="text-center text-gray-500">No payment requests found.</p>;
  }

  return (
    <div>
      {payments.map((payment) => (
        <div key={payment._id} className="bg-[#141628] p-4 rounded shadow mb-4 border border-gray-200">
          <p><strong>User:</strong> {payment.user}</p>
          <p><strong>Amount:</strong> ₹{payment.amount}</p>
          <p><strong>Bank Name:</strong> {payment.bankName}</p>
          <p><strong>Account Number:</strong> {payment.accountNumber}</p>
          <p><strong>IFSC Code:</strong> {payment.ifsc}</p>
          <p><strong>Status:</strong> {payment.status}</p>

          {payment.status === "Pending" && (
            <div className="mt-2">
              <button
                onClick={() => onApprove(payment._id)}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(payment._id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
