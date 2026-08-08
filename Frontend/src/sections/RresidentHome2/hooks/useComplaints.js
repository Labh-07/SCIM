import { useCallback, useEffect, useState } from "react";
import { complaintApi } from "../api/complaintApi";

export function useComplaints(enabled) {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    pending: 0,
    blockA: 0,
    blockB: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const [complaintsData, statsData] = await Promise.all([
        complaintApi.getAll(),
        complaintApi.getStats(),
      ]);
      setComplaints(complaintsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const submitComplaint = async (payload) => {
    await complaintApi.create(payload);
    await load();
  };

  const updateStatus = async (id, status) => {
    await complaintApi.updateStatus(id, status);
    await load();
  };

  return { complaints, stats, isLoading, error, refetch: load, submitComplaint, updateStatus };
}
