import React from "react";
import { Trash2 } from "lucide-react";

export default function PostCard({ post ,isAdmin , onDelete}) {
  return (
    <div className="border w-100 border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      {post.postimage_path && (
        <img
          src={`${post.postimage_path}`}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-blue-600 mb-1">{post.title}</h2>
        <p className="text-gray-700">{post.caption}</p>
      </div>

      {isAdmin && (
    <button
        type="button"
        onClick={() => onDelete(post.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
        title="Delete post"
    >
        <Trash2 size={18} />
    </button>
)}
    </div>
  );
}
