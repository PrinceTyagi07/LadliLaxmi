import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = ({ user: propUser }) => {
    const [user, setUser] = useState(propUser); // Use propUser if available, otherwise fetch
    const [loading, setLoading] = useState(!propUser); // If propUser not there, means we need to load
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // If user data is already passed as a prop, no need to fetch again
        if (propUser) {
            setLoading(false);
            return;
        }

        const fetchUserProfile = async () => {
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
    }, [propUser, navigate]); // Depend on propUser and navigate

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen-content text-2xl text-blue-600">
                Loading profile...
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

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen-content text-2xl text-red-600">
                User data not found.
            </div>
        );
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 pb-4 border-b-4 border-blue-500">
                My Profile
            </h2>
            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p className="text-lg text-gray-700"><span className="font-medium text-gray-900">Username:</span> {user.username}</p>
                        <p className="text-lg text-gray-700"><span className="font-medium text-gray-900">Email:</span> {user.email}</p>
                        <p className="text-lg text-gray-700"><span className="font-medium text-gray-900">Current Level:</span> {user.currentLevel}</p>
                        <p className="text-lg text-gray-700"><span className="font-medium text-gray-900">Wallet Balance:</span> ₹{user.walletBalance?.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Referral Information</h3>
                    {user.referrerId ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p className="text-lg text-gray-700"><span className="font-medium text-gray-900">Referred By:</span> {user.referrerId.username} ({user.referrerId.email})</p>
                            <p className="text-lg text-gray-700"><span className="font-medium text-gray-900">Your Referral ID:</span> {user._id}</p>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-700 italic">You were not referred by anyone.</p>
                    )}
                    <div className="mt-4">
                        <h4 className="text-xl font-medium text-gray-800 mb-2">Your Direct Referrals ({user.directReferrals?.length || 0})</h4>
                        {user.directReferrals && user.directReferrals.length > 0 ? (
                            <ul className="list-disc list-inside space-y-2">
                                {user.directReferrals.map((ref) => (
                                    <li key={ref._id} className="text-lg text-gray-700">
                                        {ref.username} ({ref.email}) - Level: {ref.currentLevel}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-lg text-gray-700 italic">You have no direct referrals yet.</p>
                        )}
                    </div>
                </div>

                {/* Add more sections like Bank Details, Security Settings etc. */}
            </div>
        </div>
    );
};

export default MyProfile;