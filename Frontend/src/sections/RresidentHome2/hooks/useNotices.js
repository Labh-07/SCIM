import { useEffect, useState } from "react";
import { noticeApi } from "../api/noticeApi";
import { useAuth } from "../context/AuthContext";

export function useNotices() {
  const {userData , isAdmin} = useAuth();

  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await noticeApi.getAll();
      setNotices(data);
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
    const created = await noticeApi.create(payload);
    setNotices((prev) => [created, ...prev]);
  };

  return { isAdmin , notices, isLoading, error, refetch: load, addNotice };
}
