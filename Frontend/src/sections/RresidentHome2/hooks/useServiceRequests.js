import { useCallback, useEffect, useState } from "react";
import { serviceRequestApi } from "../api/serviceRequestApi";

export function useServiceRequests(enabled, residentId) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await serviceRequestApi.getAll(
        residentId ? { residentId } : undefined
      );
      setRequests(data);
    } catch (err) {
      console.error("Error fetching service requests:", err);
      setError(err.response?.data?.message || "Failed to load service requests.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, residentId]);

  useEffect(() => {
    load();
  }, [load]);

  const submitRequest = async (payload) => {
    await serviceRequestApi.create(payload);
    await load();
  };

  return { requests, isLoading, error, refetch: load, submitRequest };
}
