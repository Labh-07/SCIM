import React from "react";
import { useComplaints } from "../../hooks/useComplaints";
import ComplaintStats from "./ComplaintStats";
import ComplaintForm from "./ComplaintForm";
import ComplaintCard from "./ComplaintCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";

// isAdmin=true (admin) sees every complaint with a status dropdown and
// no submission form. Residents get the submission form and only their
// own complaints.
export default function Complaints() {
  const {handleDeleteComplaint,userData , isAdmin, complaints, stats, isLoading, error, refetch, submitComplaint, updateStatus } =
    useComplaints(true);

  // const visibleComplaints = isAdmin
  //   ? complaints
  //   : complaints.filter((complaint) => complaint.email === (userData?.email || ""));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <ComplaintStats stats={stats} />

      {!isAdmin && (
        <ComplaintForm
          onSubmit={submitComplaint}
        />
      )}

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">{isAdmin ? "All Complaints" : "My Complaints"}</h2>
        {isLoading ? (
          <LoadingSpinner label="Loading complaints..." />
        ) : error ? (
          <ErrorBanner message={error} onRetry={refetch} />
        ) : complaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onStatusChange={isAdmin ? updateStatus : undefined}
                handleDeleteComplaint={handleDeleteComplaint}
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No complaints found.</p>
        )}
      </div>
    </div>
  );
}
