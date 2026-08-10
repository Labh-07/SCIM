import React from "react";
import StatusBadge from "../common/StatusBadge";

const STATUS_TONE = { pending: "amber", approved: "green", rejected: "red" };

// `onApprove`/`onReject` are only passed by the admin view, and only
// rendered while the request is still pending.
export default function ServiceRequestCard({ request, onApprove, onReject,isAdmin }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        {request.servicetype || "Service Request"}
      </h3>
      {request.residentname && isAdmin && (
        <p className="mb-1">
          <span className="font-semibold">Requested by:</span> {request.residentname}
        </p>
      )}
      <p className="mb-1">
        <span className="font-semibold">Status:</span>{" "}
        <StatusBadge
          status={request.status || "pending"}
          tone={STATUS_TONE[request.status] || "amber"}
        />
        <pre>      {new Date(request?.respondon).toLocaleString()}</pre>
      </p>
      <p className="mb-1">
        <span className="font-semibold">Submitted:</span>{" "}
        {new Date(request.createdon).toLocaleString()}
      </p>
      {isAdmin && <>
         {request.block && (
        <p className="mb-1">
          <span className="font-semibold">Block:</span> {request.block}
        </p>
      )}
      {request.mobileno && (
        <p className="mb-1">
          <span className="font-semibold">Mobile No:</span> {request.mobileno}
        </p>
      )}
      {request.additionalnote && (
        <p className="mb-1">
          <span className="font-semibold">Notes:</span> {request.additionalnote}
        </p>
      )}
      </>}
     

      {request.status === "approved" && request.comment && (
        <div className="mt-3 p-3 bg-green-50 rounded-md">
          <p>
            <span className="font-semibold">Admin Response:</span> {request.comment}
          </p>
          {request.approvalDate && (
            <p className="text-sm text-gray-500 mt-1">
              Approved on: {new Date(request.approvalDate).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {request.status === "rejected"  && (
        <div className="mt-3 p-3 bg-red-50 rounded-md">
          <p>
            <span className="font-semibold">Reason for Rejection:</span>{" "}
            {request.comment}
          </p>
        </div>
      )}

      {(onApprove || onReject) && request.status === "pending" && (
        <div className="flex gap-2 mt-4">
          {onApprove && (
            <button
              onClick={() => onApprove(request.id)}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
            >
              Approve
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(request.id)}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
            >
              Reject
            </button>
          )}
        </div>
      )}
    </div>
  );
}
