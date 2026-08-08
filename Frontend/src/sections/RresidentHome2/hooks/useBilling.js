import { useEffect, useState } from "react";
import { billingApi } from "../api/billingApi";

export function useBilling(enabled, residentId) {
  const [bills, setBills] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!enabled || !residentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [billsData, historyData] = await Promise.all([
        billingApi.getBillsForResident(residentId),
        billingApi.getPaymentHistory(residentId),
      ]);
      setBills(billsData);
      setPaymentHistory(historyData);
    } catch (err) {
      console.error("Error fetching billing data:", err);
      setError("Failed to load billing data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, residentId]);

  const markBillPaid = (billId) => {
    setBills((prev) =>
      prev.map((bill) => (bill.id === billId ? { ...bill, paid: true } : bill))
    );
  };

  return { bills, paymentHistory, isLoading, error, refetch: load, markBillPaid };
}
