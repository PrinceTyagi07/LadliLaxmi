
// controllers/adminController.js
exports.approveUpgrade = async (req, res) => {
  const { donationId, adminId } = req.body;
  
  try {
    // 1. Verify admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 2. Find the upgrade donation
    const donation = await Donation.findById(donationId)
      .populate('donor', 'walletBalance pendingLevel currentLevel')
      .populate('receiver', 'walletBalance');
    
    if (!donation || donation.type !== 'upgrade') {
      return res.status(404).json({ message: "Upgrade record not found" });
    }

    // 3. Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 4. Update donation status
      donation.status = 'approved';
      donation.approvedAt = new Date();
      donation.approvedBy = adminId;
      
      // 5. Credit upline's wallet
      donation.receiver.walletBalance += donation.amount;
      donation.receiver.walletTransactions.push({
        amount: donation.amount,
        type: "upgrade_received",
        status: "completed",
        level: donation.level,
        fromUser: donation.donor._id,
        description: `Upgrade commission from ${donation.donor.name}`
      });
      
      // 6. Update donor's level
      donation.donor.currentLevel = donation.donor.pendingLevel;
      donation.donor.pendingLevel = undefined;
      
      // 7. Update donor's transaction status
      const donorTransaction = donation.donor.walletTransactions.find(
        txn => txn.amount === -donation.amount && 
               txn.type === 'upgrade_payment'
      );
      if (donorTransaction) donorTransaction.status = 'completed';
      
      // 8. Save all changes
      await donation.save({ session });
      await donation.donor.save({ session });
      await donation.receiver.save({ session });
      
      await session.commitTransaction();
      
      res.json({
        success: true,
        message: "Upgrade approved successfully",
        donorLevel: donation.donor.currentLevel,
        receiverBalance: donation.receiver.walletBalance
      });
      
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Approval failed",
      error: error.message
    });
  }
};