import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Downline = () => {
    const { level } = useParams(); // Current level to display downline for
    const [targetDownlineLevel, setTargetDownlineLevel] = useState(parseInt(level) || 1);
    const [downlineMembers, setDownlineMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Max levels for dropdown
    const MAX_LEVELS = 5; // Adjust based on your system's depth

    useEffect(() => {
        const fetchDownline = async () => {
            setLoading(true);
            setError(null);
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
                const { data } = await axios.get(`/api/users/downline/${targetDownlineLevel}`, config);
                setDownlineMembers(data.members);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching downline:", err);
                setError(err.response?.data?.message || 'Failed to load downline members. Please try again.');
                setLoading(false);
            }
        };

        if (targetDownlineLevel) {
            fetchDownline();
        }
    }, [targetDownlineLevel, navigate]);

    const handleLevelChange = (e) => {
        const newLevel = parseInt(e.target.value);
        setTargetDownlineLevel(newLevel);
        navigate(`/downline/${newLevel}`); // Update URL to reflect selected level
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen-content text-2xl text-blue-600">
                Loading downline...
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
                My Downline
            </h2>

            <div className="mb-6 flex items-center space-x-4">
                <label htmlFor="downlineLevel" className="text-lg font-medium text-gray-700">View Downline Level:</label>
                <select
                    id="downlineLevel"
                    value={targetDownlineLevel}
                    onChange={handleLevelChange}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                >
                    {[...Array(MAX_LEVELS)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            Level {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            {downlineMembers.length === 0 ? (
                <p className="text-xl text-gray-600 italic text-center py-10">
                    No members found in Level {targetDownlineLevel} of your downline.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Current Level</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Level in Your Downline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {downlineMembers.map((member) => (
                                <tr key={member._id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 text-base text-gray-800">{member.username}</td>
                                    <td className="py-4 px-6 text-base text-gray-800">{member.email}</td>
                                    <td className="py-4 px-6 text-base text-gray-800">{member.currentLevel}</td>
                                    <td className="py-4 px-6 text-base text-gray-800">{member.levelInDownline}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Downline;
