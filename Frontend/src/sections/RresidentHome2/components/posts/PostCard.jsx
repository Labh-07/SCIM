import React from "react";

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8080";

export default function PostCard({ post }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      {post.imageUrl && (
        <img
          src={`${API_BASE_URL}/${post.imageUrl}`}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-blue-600 mb-1">{post.title}</h2>
        <p className="text-gray-700">{post.caption}</p>
      </div>
    </div>
  );
}
