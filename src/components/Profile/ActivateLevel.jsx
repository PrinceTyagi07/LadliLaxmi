import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ActivateLevel = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInitiatePayment = async () => {
        setMessage('');
        setError('');
        setLoading(true);

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError('Not authenticated. Please log in.');
            navigate('/login');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('/api/users/initiate-level1-payment', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(res.data.message);
            window.location.href = res.data.paymentUrl;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate Level 1 payment.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 py-10 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 border-b-4 pb-3 border-blue-500">
                Activate Level 1
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4">
                To activate your Level 1 and start earning, please make a donation of <span className="font-bold text-green-600">₹300</span> to your referrer.
            </p>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6">
                You will be redirected to our secure payment gateway to complete the transaction.
            </p>

            <button
                onClick={handleInitiatePayment}
                className={`w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 text-base sm:text-lg md:text-xl
                    ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
            >
                {loading ? 'Redirecting to Payment...' : 'Pay Now (₹300)'}
            </button>

            {message && <p className="mt-6 text-green-600 text-sm sm:text-base md:text-lg">{message}</p>}
            {error && <p className="mt-6 text-red-600 text-sm sm:text-base md:text-lg">{error}</p>}
        </div>
    );
};

export default ActivateLevel;
