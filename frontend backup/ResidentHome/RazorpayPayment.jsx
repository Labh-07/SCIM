import React from 'react';
import axios from 'axios';

const RazorpayPayment = ({ amount, description, billId, residentId, onSuccess, onClose }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    try {
      // 1. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }
  
      // 2. Create order on YOUR backend (not directly from frontend)
      const orderResponse = await axios.post(
        'http://localhost:8080/api/payments/create-order',
        {
          amount: Math.round(amount * 100), // Convert to paise (integer)
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            residentId: residentId,
            billId: billId
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      const options = {
        key: 'rzp_test_6MGttoeei2doc6', //  actual test key
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.id,
        name: 'Society Management System',
        description: description,
        handler: async function(response) {
          // Verify payment on your server
          await verifyPayment(response, orderResponse.data.id);
        },
        prefill: {
          name: localStorage.getItem("userName") || 'Resident',
          email: localStorage.getItem("userEmail") || 'resident@example.com',
          contact: localStorage.getItem("userPhone") || '9999999999'
        },
        theme: {
          color: '#3399cc'
        }
      };
  
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const verifyPayment = async (paymentResponse, orderId) => {
    try {
      const verificationResponse = await axios.post(
        'http://localhost:8080/api/payments/verify',
        {
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpaySignature: paymentResponse.razorpay_signature,
          orderId: orderId,
          amount: amount,
          residentId: residentId,
          billId: billId
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      if (verificationResponse.data.success) {
        onSuccess(paymentResponse, billId);
      } else {
        alert('Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Payment verification failed. Please contact support.');
    }
  };

  return (
    <button 
      className="pay-button" 
      onClick={displayRazorpay}
      style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '8px'
      }}
    >
      Pay Now
    </button>
  );
};

export default RazorpayPayment;