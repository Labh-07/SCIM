import React, { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { useNotices } from "../../hooks/useNotices";
import NoticeCard from "./NoticeCard";
import NoticeForm from "./NoticeForm";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";
import EmptyState from "../common/EmptyState";
// `canCreate` lets the same component serve both the resident (read-only)
// and admin (can post) views — pass canCreate={true} on the admin dashboard.
export default function Notices() {
  const {handleDeleteClick, isAdmin , notices, isLoading, error, refetch, addNotice } = useNotices();
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bell size={22} /> Notices
        </h1>
        {isAdmin && (
          <button
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setShowNoticeForm(true)}
          >
            <Plus size={16} /> New Notice
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading notices..." />
      ) : error ? (
        <ErrorBanner message={error} onRetry={refetch} />
      ) : notices.length === 0 ? (
        <EmptyState title="No notices yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notices.map((notice) => (
            <NoticeCard key={notice._id} notice={notice} handleDeleteClick={handleDeleteClick} isAdmin={isAdmin}/>
          ))}
        </div>
      )}

      {showNoticeForm && (
        <NoticeForm onSubmit={addNotice} onClose={() => setShowNoticeForm(false)} />
      )}
    </div>
  );
}
