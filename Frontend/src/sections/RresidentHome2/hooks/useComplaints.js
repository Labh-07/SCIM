import { useCallback, useEffect, useState } from "react";
import { complaintApi } from "../api/complaintApi";
import { useAuth } from "../context/AuthContext";


export function useComplaints(enabled) {
  const { userData , isAdmin } = useAuth();
  
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress:0,
    solved: 0,
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
        complaintApi.getAll(userData.societyid),
        complaintApi.getStats(userData.societyid),
      ]);
      console.log(complaintsData)
      console.log(statsData)
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
    await complaintApi.create(payload,userData?.societyid);
    await load();
  };

  const updateStatus = async (complaint_id, status , comment) => {
    await complaintApi.updateComplaint(userData?.societyid,complaint_id, status , comment);
    await load();
  };

  const handleDeleteComplaint = async (complaintid) => {
    await complaintApi?.deleteComplaint(userData?.societyid , complaintid)
    await load();
  }

  return { handleDeleteComplaint,userData , isAdmin,complaints, stats, isLoading, error, refetch: load, submitComplaint, updateStatus };
}
