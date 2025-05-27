import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserSidebar from './userSidebar';
import MyProfile from './MyProfile';
import TransactionHistory from './TransactionHistory';
import ActivateLevel from './ActivateLevel';
import UpgradeLevel from './Upgradelevel'
import Downline from './Downline';
import DashboardOverview from './DashboardOverview';
import axios from 'axios';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                navigate('/account');
                return;
            }
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get('/api/users/my-profile', config);
                setUser(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError('Failed to load profile. Please log in again.');
                localStorage.removeItem('jwtToken');
                navigate('/login');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-2xl text-blue-600">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-2xl text-red-600">
                {error}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen text-2xl text-red-600">
                User data not found. Redirecting to login.
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <UserSidebar user={user} onLogout={handleLogout} />
            <div className="flex-grow ml-64 p-8"> {/* ml-64 corresponds to w-64 sidebar */}
                <Routes>
                    <Route path="/account" element={<DashboardOverview user={user} />} />
                    <Route path="profile" element={<MyProfile user={user} />} />
                    <Route path="transactions" element={<TransactionHistory/>} />
                    <Route path="activate" element={<ActivateLevel />} />
                    <Route path="upgrade/:level" element={<UpgradeLevel/>} />
                    <Route path="downline/:level" element={<DownlineScreen />} />

                </Routes>
            </div>
        </div>
    );
};

export default UserDashboard;