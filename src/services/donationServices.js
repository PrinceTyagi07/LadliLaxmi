import api from './api';

export const createDonationOrder = async (userId, level) => {
  return api.post('/donations/create-order', { userId, level });
};

export const verifyDonationPayment = async (paymentData) => {
  return api.post('/donations/verify-payment', paymentData);
};

export const getDonationHistory = async (userId) => {
  return api.get(`/donations/history/${userId}`);
};