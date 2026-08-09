import React from "react";
import StatusBadge from "../common/StatusBadge";

const STATUS_TONE = { Pending: "amber", "In Progress": "blue", Solved: "green" };
const STATUS_OPTIONS = ["Pending", "In Progress", "Solved"];

// `onStatusChange` is only passed by the admin view, which also shows
// block/flat so admins can locate the complaint without extra clicks.
export default function ComplaintCard({ complaint, onStatusChange }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">{complaint.title}</h3>
      <p className="mb-1">
        <span className="font-semibold">Submitted by:</span> {complaint.name}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Date:</span>{" "}
        {new Date(complaint.createdAt).toLocaleString()}
      </p>
      {onStatusChange && (
        <>
          <p className="mb-1">
            <span className="font-semibold">Block:</span> {complaint.block}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Flat No:</span> {complaint.flatNo}
          </p>
        </>
      )}
      <p className="mb-1">
        <span className="font-semibold">Description:</span> {complaint.description}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Status:</span>{" "}
        <StatusBadge status={complaint.status} tone={STATUS_TONE[complaint.status] || "amber"} />
      </p>

      {onStatusChange && (
        <select
          value={complaint.status}
          onChange={(e) => onStatusChange(complaint.id, e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
