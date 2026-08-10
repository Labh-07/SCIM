import React, { useState } from "react";
import StatusBadge from "../common/StatusBadge";

const STATUS_TONE = {
  Pending: "amber",
  "In Progress": "blue",
  Solved: "green",
};
const STATUS_OPTIONS = ["Pending", "In Progress", "Solved"];

// `onStatusChange` is only passed by the admin view, which also shows
// block/flat so admins can locate the complaint without extra clicks.
export default function ComplaintCard({ handleDeleteComplaint,complaint, onStatusChange }) {
  const [isResponding, setIsResponding] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(complaint.status);
  const [adminComment, setAdminComment] = useState(complaint.comment || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onStatusChange) {
      onStatusChange(complaint.id, selectedStatus, adminComment);
    }
    setIsResponding(false); // Close the form after submission
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        {complaint.title}
      </h3>
      <p className="mb-1">
        <span className="font-semibold">Submitted by:</span>{" "}
        {complaint.residentname || "Na"}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Date:</span>{" "}
        {new Date(complaint.createdon).toLocaleString()}
      </p>
      {onStatusChange && (
        <>
          <p className="mb-1">
            <span className="font-semibold">Block:</span> {complaint.block}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Flat No:</span> {complaint.flatno}
          </p>
        </>
      )}
      <p className="mb-1">
        <span className="font-semibold">Description:</span>{" "}
        {complaint.description}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Comment:</span>{" "}
        {complaint.comment || "Na"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Status:</span>{" "}
        <StatusBadge
          status={complaint.status}
          tone={STATUS_TONE[complaint.status] || "amber"}
        />
      </p>

      {/* Admin Quick Action Button */}
      {onStatusChange && !isResponding && (
        <button
          onClick={() => setIsResponding(true)}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Respond
        </button>
      )}

      {/* Action Form Toggle Box */}
      {onStatusChange && isResponding && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-3 bg-gray-50 border rounded-md"
        >
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Update Complaint
          </h4>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Comment
            </label>
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Add your note here..."
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsResponding(false)}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>

            {complaint.status == "Solved" ? (
              <button
                type="button"
                onClick={()=>{handleDeleteComplaint(complaint?.id)}}
                className="px-3 py-1.5 text-sm text-white bg-red-400 rounded-md hover:bg-red:600"
              >
                Delete
              </button>
            ) : (
              <button
                type="submit"
                className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Submit Response
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
