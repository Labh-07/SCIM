import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useComplaints } from "../../hooks/useComplaints";
import ComplaintStats from "./ComplaintStats";
import ComplaintForm from "./ComplaintForm";
import ComplaintCard from "./ComplaintCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";

export default function Complaints() {
  const { userData } = useAuth();
  const { complaints, stats, isLoading, error, refetch, submitComplaint } =
    useComplaints(true);

  const myComplaints = complaints.filter(
    (complaint) => complaint.email === (userData?.email || "")
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <ComplaintStats stats={stats} />

      <ComplaintForm
        defaultName={userData?.name}
        defaultBlock={userData?.block}
        defaultFlatNo={userData?.flatNo}
        onSubmit={submitComplaint}
      />

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">My Complaints</h2>
        {isLoading ? (
          <LoadingSpinner label="Loading complaints..." />
        ) : error ? (
          <ErrorBanner message={error} onRetry={refetch} />
        ) : myComplaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No complaints found.</p>
        )}
      </div>
    </div>
  );
}
