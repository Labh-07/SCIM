import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useServiceRequests } from "../../hooks/useServiceRequests";
import ServiceRequestForm from "./ServiceRequestForm";
import ServiceRequestCard from "./ServiceRequestCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";
import EmptyState from "../common/EmptyState";

export default function RequestServices() {
  const { userData } = useAuth();
  const { requests, isLoading, error, refetch, submitRequest } = useServiceRequests(
    true,
    userData?.id
  );

  const myRequests = requests.filter(
    (request) =>
      request.name === userData?.name ||
      request.email === userData?.email ||
      request.residentId === userData?.id
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <ServiceRequestForm defaultName={userData?.name} onSubmit={submitRequest} />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Service Requests</h2>
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
        ) : myRequests.length === 0 ? (
          <EmptyState
            title="No service requests found."
            subtitle="Submit a request using the form above."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRequests.map((request) => (
              <ServiceRequestCard key={request._id || request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
