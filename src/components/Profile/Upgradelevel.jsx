import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Upgradelevel = () => {
    const { level } = useParams(); // Get target level from URL
    const targetLevel = parseInt(level);

    const [upgradeCost, setUpgradeCost] = useState(0);
    const [requirements, setRequirements] = useState({}); // To display requirements
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const navigate = useNavigate();

    // In a real app, you'd fetch this from backend config or a dedicated API
    const LEVELS_CONFIG = {
        1: { donation_to_referrer: 300, upgrade_cost: 500, required_direct_referrals_for_upgrade: 2 },
        2: { donation_from_downline: 500, upgrade_cost: 1000, required_downline_at_level: { level: 1, count: 2 } },
        3: { donation_from_downline: 1000, upgrade_cost: 2000, required_downline_at_level: { level: 2, count: 4 } },
        // ... add all your levels up to 11
    };

    useEffect(() => {
        if (isNaN(targetLevel) || !LEVELS_CONFIG[targetLevel]) {
            setError('Invalid level specified.');
            setLoading(false);
            return;
        }
        setUpgradeCost(LEVELS_CONFIG[targetLevel].upgrade_cost);
        setRequirements({
            directReferrals: LEVELS_CONFIG[targetLevel].required_direct_referrals_for_upgrade,
            downlineAtLevel: LEVELS_CONFIG[targetLevel].required_downline_at_level
        });
        setLoading(false);
    }, [targetLevel]);

    const handleInitiatePayment = async () => {
        setMessage('');
        setError('');
        setPaymentLoading(true);

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError('Not authenticated. Please log in.');
            navigate('/login');
            setPaymentLoading(false);
            return;
        }

        try {
            const res = await axios.post(`/api/users/initiate-upgrade-payment/${targetLevel}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(res.data.message);
            window.location.href = res.data.paymentUrl; // Redirect to PG
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate upgrade payment.');
            console.error(err);
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen-content text-2xl text-blue-600">
                Loading upgrade details...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen-content text-2xl text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 pb-4 border-b-4 border-blue-500">
                Upgrade to Level {targetLevel}
            </h2>
            <p className="text-xl text-gray-700 mb-6">
                The cost to upgrade to Level {targetLevel} is <span className="font-bold text-green-600">₹{upgradeCost?.toFixed(2)}</span>.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Requirements for Upgrade:</h3>
                <ul className="list-disc list-inside text-left space-y-2 text-lg text-gray-700">
                    {requirements.directReferrals && (
                        <li>You need at least <span className="font-medium">{requirements.directReferrals}</span> direct referrals.</li>
                    )}
                    {requirements.downlineAtLevel && (
                        <li>At least <span className="font-medium">{requirements.downlineAtLevel.count}</span> of your direct referrals must be at Level <span className="font-medium">{requirements.downlineAtLevel.level}</span>.</li>
                    )}
                    {/* Add other dynamic requirements here */}
                    <li>Sufficient balance in your wallet or make a fresh payment.</li>
                </ul>
            </div>

            <button
                onClick={handleInitiatePayment}
                className={`w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 text-xl
                    ${paymentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={paymentLoading}
            >
                {paymentLoading ? 'Redirecting to Payment...' : `Pay Now (₹${upgradeCost?.toFixed(2)})`}
            </button>

            {message && <p className="mt-6 text-green-600 text-lg">{message}</p>}
            {error && <p className="mt-6 text-red-600 text-lg">{error}</p>}
        </div>
    );
};

export default Upgradelevel;
