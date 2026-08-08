import React from "react";

export default function ResidentCard({ resident, handleEditClick, isAdmin }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        {resident?.residentname}
      </h3>
      {/* <p className="mb-1">
        <span className="font-semibold">Email:</span> {resident.email}
      </p> */}
      <p className="mb-1">
        <span className="font-semibold">Block:</span> {resident?.block || "N/A"}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Flat No:</span>{" "}
        {resident?.flatno || "N/A"}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Phone:</span>{" "}
        {resident?.mobileno || "N/A"}
      </p>
      <p className="mb-3">
        <span className="font-semibold">Role:</span> {resident?.role}
      </p>
      {isAdmin && (
        <button
          onClick={() => handleEditClick(resident)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
      )}
    </div>
  );
}
