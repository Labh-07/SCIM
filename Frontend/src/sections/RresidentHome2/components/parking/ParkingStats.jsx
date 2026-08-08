import React from "react";

export default function ParkingStats({ blocks, stats }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Parking Utilization</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {["all", ...blocks].map((block) => (
          <div key={block} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">{block === "all" ? "All Blocks" : `Block ${block}`}</h3>
            <p className="text-sm text-gray-600">Total Spaces: {stats[block]?.total || 0}</p>
            <p className="text-sm text-gray-600">Occupied: {stats[block]?.occupied || 0}</p>
            <p className="text-sm text-gray-600">Available: {stats[block]?.available || 0}</p>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${stats[block]?.percentage || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{stats[block]?.percentage || 0}% occupied</p>
          </div>
        ))}
      </div>
    </div>
  );
}
