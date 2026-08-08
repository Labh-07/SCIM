import React, { useEffect } from 'react';
import './css/PaymentPage.css';

const RazorpayPayment = ({ amount, description, billId, residentId, onSuccess, onClose }) => {
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onerror = () => console.error('Failed to load Razorpay script');
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    };

    loadScript();
  }, []);

  const handlePayment = () => {
    if (!window.Razorpay) {
      console.error('Razorpay SDK not loaded');
      return;
    }

    const options = {
      key: 'rzp_test_6MGttoeei2doc6', // Replace with your test key
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: 'Society Maintenance',
      description: description,
      handler: function(response) {
        onSuccess(response, billId);
      },
      prefill: {
        name: localStorage.getItem('userName') || 'Resident',
        email: localStorage.getItem('userEmail') || '',
        contact: localStorage.getItem('userPhone') || ''
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button 
      className="pay-button" 
      onClick={handlePayment}
      style={{ padding: '10px 20px', fontSize: '16px' }}
    >
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayPayment;