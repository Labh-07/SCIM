import React from "react";

export default function ParkingCard({ item }) {
  return (
    <div
      className={`border rounded-lg p-4 bg-white hover:shadow-md transition-shadow ${
        item.isOccupied ? "border-red-200" : "border-green-200"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{item.parkingId}</h3>
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            item.isOccupied ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {item.isOccupied ? "Occupied" : "Available"}
        </span>
      </div>
      <p className="text-gray-700">Block: {item.block}</p>
      <p className="text-gray-700">Flat: {item.flatNo}</p>
      {item.residentName && <p className="text-gray-700">Resident: {item.residentName}</p>}
    </div>
  );
}
