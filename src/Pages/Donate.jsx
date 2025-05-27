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
    <div className="donate-page">
      <h1>Provide Help</h1>
      
      <DonationForm 
        level={donationLevel}
        onLevelChange={setDonationLevel}
        onSubmit={() => setShowModal(true)}
      />

      {donationStatus === 'success' && (
        <div className="success-message">
          Donation completed successfully!
        </div>
      )}

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