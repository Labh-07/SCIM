import React, { useState } from "react";
import { Pen, Plus } from "lucide-react";
import { usePosts } from "../../hooks/usePosts";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";
import EmptyState from "../common/EmptyState";

export default function Posts() {
  const {handleDeletePost,isAdmin, posts, isLoading, error, addPost } = usePosts();
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Pen size={22} /> Posts
        </h1>
        {isAdmin && (
          <button
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setShowPostForm(true)}
          >
            <Plus size={16} /> New Post
          </button>
        )}
      </div>

      <ErrorBanner message={error} />

      {isLoading ? (
        <LoadingSpinner label="Loading posts..." />
      ) : posts.length === 0 ? (
        <EmptyState title="No posts yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} isAdmin={isAdmin} onDelete={handleDeletePost}/>
          ))}
        </div>
      )}

      {showPostForm && (
        <PostForm onSubmit={addPost} onClose={() => setShowPostForm(false)} />
      )}
    </div>
  );
}
