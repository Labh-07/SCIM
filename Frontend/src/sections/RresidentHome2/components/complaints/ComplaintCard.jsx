import React from "react";
import StatusBadge from "../common/StatusBadge";

const STATUS_TONE = { Pending: "amber", "In Progress": "blue", Solved: "green" };

export default function ComplaintCard({ complaint }) {
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
      <p className="mb-1">
        <span className="font-semibold">Description:</span> {complaint.description}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Status:</span>{" "}
        <StatusBadge status={complaint.status} tone={STATUS_TONE[complaint.status] || "amber"} />
      </p>
    </div>
  );
}
