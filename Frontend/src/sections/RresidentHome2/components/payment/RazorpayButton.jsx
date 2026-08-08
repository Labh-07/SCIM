import React, { useEffect } from "react";
import { paymentApi } from "../../api/paymentApi";

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
// TODO: move to an environment variable before shipping to production.
const RAZORPAY_KEY = import.meta.env?.VITE_RAZORPAY_KEY || "rzp_test_6MGttoeei2doc6";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Renders a "Pay Now" button that creates an order on the backend,
 * opens Razorpay checkout, then asks the backend to verify the
 * payment signature before calling onSuccess.
 */
export default function RazorpayButton({ amount, description, billId, residentId, onSuccess }) {
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const verifyPayment = async (paymentResponse, orderId) => {
    try {
      const verification = await paymentApi.verify({
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpaySignature: paymentResponse.razorpay_signature,
        orderId,
        amount,
        residentId,
        billId,
      });

      if (verification.success) {
        onSuccess(paymentResponse, billId);
      } else {
        alert("Payment verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Payment verification failed. Please contact support.");
    }
  };

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const order = await paymentApi.createOrder({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { residentId, billId },
      });

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Society Management System",
        description,
        handler: (response) => verifyPayment(response, order.id),
        prefill: {
          name: localStorage.getItem("userName") || "Resident",
          email: localStorage.getItem("userEmail") || "",
          contact: localStorage.getItem("userPhone") || "",
        },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      alert(`Payment failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
    >
      Pay Now
    </button>
  );
}
