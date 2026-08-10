import { useCallback, useEffect, useState } from "react";
import { serviceRequestApi } from "../api/serviceRequestApi";
import { useAuth } from "../context/AuthContext";

export function useServiceRequests( ) {
  const {isAdmin, userData } = useAuth();

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await serviceRequestApi.getAll(
       userData?.societyid
      );
      setRequests(data);
    } catch (err) {
      console.error("Error fetching service requests:", err);
      setError(err.response?.data?.message || "Failed to load service requests.");
    } finally {
      setIsLoading(false);
    }
  }, [ userData]);

  useEffect(() => {
    load();
  }, [load]);

  const submitRequest = async (payload) => {
    console.log(payload)
    await serviceRequestApi.create(userData?.societyid,payload);
    await load();
  };

  // Admin-only actions.
  const approveRequest = async (service_id, adminNotes) => {
    const updated = await serviceRequestApi.updateService(userData?.societyid,service_id,"approved", adminNotes);
    setRequests((prev) => prev.map((req) => (req.id === service_id ? updated : req))); // if this not work proper use load
  };

  const rejectRequest = async (service_id, rejectionReason) => {
    const updated = await serviceRequestApi.updateService(userData?.societyid , service_id, "rejected", rejectionReason);
    setRequests((prev) => prev.map((req) => (req.id === service_id ? updated : req)));
  };

  return {
    isAdmin, userData,

    requests,
    isLoading,
    error,
    refetch: load,
    submitRequest,
    approveRequest,
    rejectRequest,
  };
}
