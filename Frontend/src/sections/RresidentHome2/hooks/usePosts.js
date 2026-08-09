import { useEffect, useState } from "react";
import { postApi } from "../api/postApi";
import { useAuth } from "../context/AuthContext";

export function usePosts() {
  const { userData, isAdmin } = useAuth();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postApi.getAll(userData?.societyid);
      setPosts(data);
      console.log(data?.postimage_path);
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
    const created = await postApi.create(userData?.societyid, formData);
    load();
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) return;

    try {
      try {
        await postApi.delete(userData?.societyid,postId);
        load();
      } catch (err) {
        setError("Failed to delete posts");
        throw err;
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return {
    handleDeletePost,
    isAdmin,
    posts,
    isLoading,
    error,
    refetch: load,
    addPost,
  };
}
