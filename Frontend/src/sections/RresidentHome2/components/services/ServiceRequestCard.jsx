import React from "react";
import StatusBadge from "../common/StatusBadge";

const STATUS_TONE = { Pending: "amber", Approved: "green", Rejected: "red" };

export default function ServiceRequestCard({ request }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        {request.serviceType || "Service Request"}
      </h3>
      <p className="mb-1">
        <span className="font-semibold">Status:</span>{" "}
        <StatusBadge
          status={request.status || "Pending"}
          tone={STATUS_TONE[request.status] || "amber"}
        />
      </p>
      <p className="mb-1">
        <span className="font-semibold">Submitted:</span>{" "}
        {new Date(request.createdAt).toLocaleString()}
      </p>

      {request.address && (
        <p className="mb-1">
          <span className="font-semibold">Address:</span> {request.address}
        </p>
      )}
      {request.phoneNo && (
        <p className="mb-1">
          <span className="font-semibold">Phone:</span> {request.phoneNo}
        </p>
      )}
      {request.additionalNotes && (
        <p className="mb-1">
          <span className="font-semibold">Notes:</span> {request.additionalNotes}
        </p>
      )}

      {request.status === "Approved" && request.adminNotes && (
        <div className="mt-3 p-3 bg-green-50 rounded-md">
          <p>
            <span className="font-semibold">Admin Response:</span> {request.adminNotes}
          </p>
          {request.approvalDate && (
            <p className="text-sm text-gray-500 mt-1">
              Approved on: {new Date(request.approvalDate).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {request.status === "Rejected" && request.rejectionReason && (
        <div className="mt-3 p-3 bg-red-50 rounded-md">
          <p>
            <span className="font-semibold">Reason for Rejection:</span>{" "}
            {request.rejectionReason}
          </p>
        </div>
      )}
    </div>
  );
}
