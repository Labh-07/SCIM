import { useEffect, useState } from "react";
import { noticeApi } from "../api/noticeApi";
import { useAuth } from "../context/AuthContext";

export function useNotices() {
  const { userData, isAdmin } = useAuth();

  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await noticeApi.getAll(userData?.societyid);
      setNotices(data);
      console.log(data);
    } catch (err) {
      console.error("Error loading notices:", err);
      setError("Failed to load notices.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addNotice = async (payload) => {
    payload = {
      ...payload,
      societyid: userData?.societyid,
    };
    const created = await noticeApi.create(userData?.societyid, payload);
    setNotices((prev) => [created, ...prev]);
  };

  const handleDeleteClick = async (noticeId) => {
    const response = await noticeApi.delete(userData?.societyid, noticeId);

    if (
      response.status === 401 ||
      response.status === 403 ||
      response.status === 204
    ) {
      console.error("something went wrong");
    } else {
      load()
    }
  };

  return {
    handleDeleteClick,
    isAdmin,
    notices,
    isLoading,
    error,
    refetch: load,
    addNotice,
  };
}
