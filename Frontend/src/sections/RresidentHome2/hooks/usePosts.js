import { useEffect, useState } from "react";
import { postApi } from "../api/postApi";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postApi.getAll();
      setPosts(data);
    } catch (err) {
      console.error("Error loading posts:", err);
      setError("Failed to load posts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addPost = async (formData) => {
    const created = await postApi.create(formData);
    setPosts((prev) => [created, ...prev]);
  };

  return { posts, isLoading, error, refetch: load, addPost };
}
