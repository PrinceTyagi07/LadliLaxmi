import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API calls to your backend
import { useNavigate } from 'react-router-dom'; // If you need to redirect after payment
import { toast } from 'react-hot-toast'; // For user feedback (install if not already: npm install react-hot-toast)

const Donation = ({user}) => {
//     const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [razorpayLoading, setRazorpayLoading] = useState(false); // For loading the Razorpay script
    const amountToPay = 300; // Fixed amount for Level 1 activation

    // Load Razorpay script dynamically
    useEffect(() => {
        const loadRazorpayScript = () => {
            setRazorpayLoading(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                setRazorpayLoading(false);
            };
            script.onerror = () => {
                toast.error('Failed to load Razorpay script.');
                setRazorpayLoading(false);
            };
            document.body.appendChild(script);
        };

        if (!window.Razorpay) { // Only load if not already loaded
            loadRazorpayScript();
        } else {
            setRazorpayLoading(false);
        }
    }, []);

    // Function to initiate Razorpay payment
    const handleLevel1Activation = async () => {
        // if (!user || !user.token) {
        console.log(user.Id, user.currentLevel);
        if (!user) {
            toast.error('You must be logged in to activate your level.');
            navigate('/account'); // Redirect to login if not authenticated
            return;
        }

        if (loading) return; // Prevent double clicks

        setLoading(true);
        try {
            
            // 1. Call your backend to create a Razorpay order
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `http://localhost:4001/api/v1/donations/create-order`, // Your backend endpoint
                { userId: user.Id, currentLevel: user.currentLevel }, // Send required data to backend
                config
                // { amount: amountToPay, userId: user.Id, currentLevel: user.currentLevel }, // Send required data to backend
            );

            if (!data.success) {
                toast.error(data.message || 'Failed to create payment order.');
                setLoading(false);
                return;
            }

            const { order } = data; // Get the order details from your backend
            // 2. Open Razorpay checkout
            const options = {
                key: "rzp_test_t4LUM04KXw6wHc", // Your Razorpay Key ID
                amount: order.amount, // Amount in paisa (Razorpay expects amount in smallest currency unit)
                currency: order.currency,
                name: 'Ladli Laxmi Trust',
                description: 'Level 1 Activation Payment',
                order_id: order.id, // Order ID from your backend
                handler: async function (response) {
                    // This function is called on successful payment
                    setLoading(true); // Re-engage loading state for verification
                    try {
                        // 3. Verify payment with your backend
                        const verificationResponse = await axios.post(
                            `${process.env.REACT_APP_BACKEND_URL}/api/v1/donations/verify-payment`, // Your backend verification endpoint
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                userId: user._id,
                                currentLevel: 1, // Confirm level for verification
                            },
                            config
                        );

                        if (verificationResponse.data.success) {
                            toast.success('Level 1 activated successfully!');
                            // You might want to re-fetch user data to update UI
                            if (fetchUserData) {
                                await fetchUserData(); // Call parent function to re-fetch user data
                            }
                            // Navigate to dashboard or a success page
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
                    name: user.name, // Prefill user's name if available
                    email: user.email, // Prefill user's email if available
                    contact: user.phone || '', // Prefill user's phone if available
                },
                notes: {
                    userId: user._id,
                    currentLevel: 1,
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
            rzp1.open(); // Open the Razorpay modal

        } catch (error) {
            console.error('Error initiating Razorpay payment:', error);
            const errorMessage = error.response?.data?.message || 'Failed to initiate payment. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Render logic based on user's current level (assuming user.currentLevel is available)
    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen-content text-2xl text-gray-600">
                Please log in to view this page.
            </div>
        );
    }

    if (user.currentLevel && user.currentLevel >= 1) {
        return (
            <div className="p-8 bg-white rounded-lg shadow-lg max-w-xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-green-600 mb-4">
                    Congratulations!
                </h2>
                <p className="text-xl text-gray-700 mb-6">You have already activated Level 1.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-lg max-w-xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 pb-4 border-b-4 border-blue-500 text-center">
                Activate Level 1
            </h2>

            {razorpayLoading ? (
                <p className="text-center text-blue-600 text-lg">Loading payment gateway...</p>
            ) : (
                <>
                    <p className="text-lg text-gray-700 mb-6 text-center">
                        To participate and earn commissions, please activate your Level 1 by paying ₹{amountToPay}.
                    </p>
                    <div className="text-center">
                        <button
                            onClick={handleLevel1Activation}
                            disabled={loading}
                            className={`px-8 py-4 rounded-lg text-white font-semibold text-xl shadow-md transition duration-300
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {loading ? 'Processing...' : `Pay ₹${amountToPay} to Activate Level 1`}
                        </button>
                    </div>
                </>
            )}

            {/* Optional: Add instructions or benefits of activating level 1 */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-gray-600 text-sm">
                <h3 className="font-semibold text-lg mb-2">Why Activate Level 1?</h3>
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