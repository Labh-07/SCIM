import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useComplaints } from "../../hooks/useComplaints";
import ComplaintStats from "./ComplaintStats";
import ComplaintForm from "./ComplaintForm";
import ComplaintCard from "./ComplaintCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";

// canManage=true (admin) sees every complaint with a status dropdown and
// no submission form. Residents get the submission form and only their
// own complaints.
export default function Complaints({ canManage = false }) {
  const { userData } = useAuth();
  const { complaints, stats, isLoading, error, refetch, submitComplaint, updateStatus } =
    useComplaints(true);

  const visibleComplaints = canManage
    ? complaints
    : complaints.filter((complaint) => complaint.email === (userData?.email || ""));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <ComplaintStats stats={stats} />

      {!canManage && (
        <ComplaintForm
          defaultName={userData?.name}
          defaultBlock={userData?.block}
          defaultFlatNo={userData?.flatNo}
          onSubmit={submitComplaint}
        />
      )}

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">{canManage ? "All Complaints" : "My Complaints"}</h2>
        {isLoading ? (
          <LoadingSpinner label="Loading complaints..." />
        ) : error ? (
          <ErrorBanner message={error} onRetry={refetch} />
        ) : visibleComplaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onStatusChange={canManage ? updateStatus : undefined}
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
