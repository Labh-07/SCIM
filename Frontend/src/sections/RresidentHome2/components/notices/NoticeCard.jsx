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

export default function NoticeCard({ notice }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>{formatDate(notice.scheduleAt)}</span>
        <span>{notice.createdBy || "Admin"}</span>
      </div>
      <div className="text-lg font-semibold text-blue-600 mb-1">{notice.title}</div>
      <div className="text-gray-700">{notice.content}</div>
      {notice.isImportant && (
        <div className="inline-block mt-3 px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold">
          IMPORTANT
        </div>
      )}
    </div>
  );
}
