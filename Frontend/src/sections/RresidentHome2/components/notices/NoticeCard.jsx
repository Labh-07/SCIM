
import React from "react";

function formatDate(dateString) {
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(dateString).toLocaleDateString("en-US", options);
}

export default function NoticeCard({ notice, handleDeleteClick ,isAdmin}) {
console.log(notice)
  return (
    <div className="relative w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">

      {/* Delete Button */}
      {isAdmin && <button
        onClick={() => {handleDeleteClick(notice?.id)}}
        className="
          absolute
          top-4
          right-4
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          text-gray-400
          transition-all
          duration-200
          hover:bg-red-50
          hover:text-red-600
          focus:outline-none
          focus:ring-2
          focus:ring-red-200
          cursor-pointer
        "
        title="Delete Notice"
        aria-label="Delete Notice"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>}
      

      {/* Notice Header */}
      <div className="pr-12">
         <p className="mt-1 mb-2 text-sm font-medium text-gray-900">
          {notice.author?.username || "Admin"}
        </p>
        
        <p className="text-sm text-gray-500">
          {formatDate(notice.createdon)}
        </p>
      </div>

      {/* Notice Content */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {notice.title}
        </h2>

        <p className="mt-2 whitespace-pre-wrap text-gray-600">
          {notice.content}
        </p>
      </div>

      {/* Important Badge */}
      {notice.important && (
        <div className="mt-4">
          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            IMPORTANT
          </span>
        </div>
      )}
    </div>
  );
}
