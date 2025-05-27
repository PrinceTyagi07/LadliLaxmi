import axios from 'axios';
import Razorpay from 'razorpay';

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initializeRazorpay = (options) => {
  return new Promise((resolve) => {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      resolve({ success: false, response });
    });
    rzp.open();
    resolve({ success: true });
  });
};

// export const createOrder = async (userId, level) => {
//   const response = await axios.post('/api/donations/create-order', { userId, level });
//   return response.data;
// };

// export const verifyPayment = async (paymentData) => {
//   const response = await axios.post('/api/donations/verify-payment', paymentData);
//   return response.data;
// };