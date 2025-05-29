import { useState } from 'react';
import PaymentModal from '../components/Donation/PaymentModal';
import DonationForm from '../components/Donation/DonationForm';

const DonatePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [donationLevel, setDonationLevel] = useState(1);
  const [donationStatus, setDonationStatus] = useState(null);

  // Get from auth context or props
  const userId = "current_user_id";

  const handleDonationSuccess = () => {
    setShowModal(false);
    setDonationStatus('success');
    setTimeout(() => setDonationStatus(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Provide Help
        </h1>

        <DonationForm 
          level={donationLevel}
          onLevelChange={setDonationLevel}
          onSubmit={() => setShowModal(true)}
        />

        {donationStatus === 'success' && (
          <div className="mt-4 text-green-600 text-center font-medium bg-green-100 p-3 rounded-md shadow">
            Donation completed successfully!
          </div>
        )}
      </div>

      {showModal && (
        <PaymentModal
          userId={userId}
          level={donationLevel}
          onClose={() => setShowModal(false)}
          onSuccess={handleDonationSuccess}
        />
      )}
    </div>
  );
};

export default DonatePage;
