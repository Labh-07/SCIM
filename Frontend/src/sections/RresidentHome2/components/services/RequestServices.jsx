import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useServiceRequests } from "../../hooks/useServiceRequests";
import ServiceRequestForm from "./ServiceRequestForm";
import ServiceRequestCard from "./ServiceRequestCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";
import EmptyState from "../common/EmptyState";

// isAdmin=true (admin) shows every resident's requests with
// approve/reject actions and hides the submission form. Residents get
// the submission form and only their own requests.
export default function RequestServices() {
  const {isAdmin, userData , requests, isLoading, error, refetch, submitRequest, approveRequest, rejectRequest } =
    useServiceRequests();

  const handleApprove = async (id) => {
    const adminNotes = window.prompt("Enter any additional notes for approval:");
    try {
      await approveRequest(id, adminNotes);
    } catch (err) {
      alert("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    const rejectionReason = window.prompt("Please enter the reason for rejection:");
    if (!rejectionReason) return;
    try {
      await rejectRequest(id, rejectionReason);
    } catch (err) {
      alert("Failed to reject request");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {!isAdmin && (
        <ServiceRequestForm defaultName={userData?.name} onSubmit={submitRequest} />
      )}

      <div className={isAdmin ? undefined : "mt-6"}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isAdmin ? "Service Requests" : "My Service Requests"}
          </h2>
          <button
            onClick={refetch}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner label="Loading requests..." />
        ) : error ? (
          <ErrorBanner message={error} onRetry={refetch} />
        ) : requests.length === 0 ? (
          <EmptyState
            title="No service requests found."
            subtitle={isAdmin ? undefined : "Submit a request using the form above."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((request) => (
              <ServiceRequestCard
                key={request._id || request.id}
                request={request}
                onApprove={isAdmin ? handleApprove : undefined}
                onReject={isAdmin ? handleReject : undefined}
                isAdmin = {isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
