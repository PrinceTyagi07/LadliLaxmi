import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get('/api/transactions/my', config);
                setTransactions(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching transactions:", err);
                setError('Failed to load transactions. Please try again.');
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [navigate]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen-content text-2xl text-blue-600">
                Loading transactions...
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
        <div className="p-8 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 pb-4 border-b-4 border-blue-500">
                Transaction History
            </h2>
            {transactions.length === 0 ? (
                <p className="text-xl text-gray-600 italic text-center py-10">No transactions found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Level</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 text-base text-gray-800">{formatDate(tx.createdAt)}</td>
                                    <td className="py-4 px-6 text-base text-gray-800">{tx.type.replace(/_/g, ' ')}</td>
                                    <td className={`py-4 px-6 text-base font-semibold ${tx.type.includes('in') || tx.type.includes('upgrade_cost') ? 'text-green-600' : 'text-red-600'}`}>
                                        ₹{tx.amount?.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 text-base text-gray-800">{tx.level}</td>
                                    <td className={`py-4 px-6 text-base font-medium ${
                                        tx.status === 'completed' ? 'text-green-500' :
                                        tx.status === 'pending' ? 'text-yellow-500' :
                                        'text-red-500'
                                    }`}>
                                        {tx.status}
                                    </td>
                                    <td className="py-4 px-6 text-base text-gray-800">{tx.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;