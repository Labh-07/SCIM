import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useBilling } from "../../hooks/useBilling";
import BillCard from "./BillCard";
import PaymentHistoryTable from "./PaymentHistoryTable";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";

export default function Billing() {
  const { userData } = useAuth();
  const { bills, paymentHistory, isLoading, error, markBillPaid } = useBilling(
    true,
    userData?.id
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Billing Information</h2>

      <ErrorBanner message={error} />
      {isLoading && <LoadingSpinner />}

      <div className="mb-6">
        <h3 className="font-bold mb-2">Current Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              residentId={userData?.id}
              onPaid={markBillPaid}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-bold mb-4">Payment History</h3>
        <PaymentHistoryTable payments={paymentHistory} bills={bills} />
      </div>
    </div>
  );
}
