import { useState, useEffect } from 'react';
import { loadRazorpay, initializeRazorpay } from '../../services/razorpay';
import { createDonationOrder, verifyDonationPayment } from '../../services/donationService';

const PaymentModal = ({ userId, level, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // 1. Load Razorpay script
        const razorpayLoaded = await loadRazorpay();
        if (!razorpayLoaded) throw new Error('Failed to load Razorpay');

        // 2. Create order
        const { data } = await createDonationOrder(userId, level);
        
        // 3. Initialize Razorpay checkout
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: "Your Donation App",
          description: `Level ${level} Donation`,
          handler: async (response) => {
            try {
              await verifyDonationPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });
              onSuccess();
            } catch (err) {
              setError('Payment verification failed');
            }
          },
          prefill: {
            name: "Donor Name",
            email: "donor@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#3399cc"
          }
        };

        await initializeRazorpay(options);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [userId, level, onSuccess]);

  return (
    <div className="payment-modal">
      {loading ? (
        <div className="loading-spinner">Processing payment...</div>
      ) : error ? (
        <div className="error-message">
          {error}
          <button onClick={onClose}>Close</button>
        </div>
      ) : null}
    </div>
  );
};

export default PaymentModal;