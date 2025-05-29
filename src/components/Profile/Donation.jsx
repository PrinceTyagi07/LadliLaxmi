import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Donation = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const amountToPay = 400;

  useEffect(() => {
    const loadRazorpayScript = () => {
      setRazorpayLoading(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoading(false);
      script.onerror = () => {
        toast.error('Failed to load Razorpay script.');
        setRazorpayLoading(false);
      };
      document.body.appendChild(script);
    };

    if (!window.Razorpay) loadRazorpayScript();

    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) script.remove();
    };
  }, []);

  const handleLevel1Activation = async () => {
    if (!user) {
      toast.error('You must be logged in to activate your level.');
      navigate('/account');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4001/api/v1/donations/create-order`,
        { userId: user.Id, currentLevel: user.currentLevel },
        config
      );

      if (!data.success) {
        toast.error(data.message || 'Failed to create payment order.');
        setLoading(false);
        return;
      }

      const { order } = data;

      const options = {
        key: "rzp_test_5cal2pq9rBLw7n",
        amount: order.amount,
        currency: order.currency,
        name: 'Ladli Laxmi Trust',
        description: 'Level 1 Activation Payment',
        order_id: order.id,
        handler: async (response) => {
          setLoading(true);
          try {
            const verificationResponse = await axios.post(
              `http://localhost:4001/api/v1/donations/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.Id,
                currentLevel: 0,
              },
              config
            );

            if (verificationResponse.data.success) {
              toast.success('Level 1 activated successfully!');
              navigate('/dashboard');
            } else {
              toast.error(verificationResponse.data.message || 'Payment verification failed.');
            }
          } catch (error) {
            console.error('Error during payment verification:', error);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        notes: {
          userId: user.Id,
          currentLevel: 0,
          type: 'level_activation',
        },
        theme: {
          color: '#3399CC',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(response.error.description || 'Payment failed. Please try again.');
        setLoading(false);
      });
      rzp1.open();

    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-xl sm:text-2xl text-gray-600 px-4 text-center">
        Please log in to view this page.
      </div>
    );
  }

  if (user.currentLevel >= 1) {
    return (
      <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-center mt-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-green-600 mb-4">Congratulations!</h2>
        <p className="text-base sm:text-lg text-gray-700 mb-6">
          You have already activated Level 1.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:p-10 bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-6">
      <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-8 text-center border-b-4 border-blue-500 pb-4">
        Activate Level 1
      </h2>

      {razorpayLoading ? (
        <p className="text-center text-blue-600 text-lg">Loading payment gateway...</p>
      ) : (
        <>
          <p className="text-base sm:text-lg text-gray-700 mb-6 text-center">
            To participate and earn commissions, please activate your Level 1 by paying ₹{amountToPay}.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleLevel1Activation}
              disabled={loading}
              className={`px-6 sm:px-10 py-3 sm:py-4 rounded-lg text-white font-semibold text-base sm:text-xl shadow-md transition duration-300
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loading ? 'Processing...' : `Pay ₹${amountToPay} to Activate Level 1`}
            </button>
          </div>
        </>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 text-gray-600 text-sm sm:text-base">
        <h3 className="font-semibold text-base sm:text-lg mb-2">Why Activate Level 1?</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Unlock earning potential from your downline.</li>
          <li>Gain access to exclusive features.</li>
          <li>Support the community.</li>
        </ul>
      </div>
    </div>
  );
};

export default Donation;
