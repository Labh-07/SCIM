import React from "react";
import RazorpayButton from "../payment/RazorpayButton";

export default function BillCard({ bill, residentId, onPaid }) {
  return (
    <div className={`p-4 rounded-lg ${bill.paid ? "bg-gray-50" : "bg-blue-50"}`}>
      <h4 className="font-semibold mb-2">{bill.type}</h4>
      <p className="text-2xl font-bold mb-1">₹{bill.amount.toLocaleString()}</p>
      <p className="text-sm text-gray-600 mb-3">
        Due: {new Date(bill.dueDate).toLocaleDateString()}
      </p>

      {bill.paid ? (
        <div className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
          Paid
        </div>
      ) : (
        <RazorpayButton
          amount={bill.amount}
          description={`Payment for ${bill.type}`}
          billId={bill.id}
          residentId={residentId}
          onSuccess={() => onPaid(bill.id)}
        />
      )}
    </div>
  );
}
