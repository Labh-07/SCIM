import React from "react";

const STAT_CARDS = [
  { key: "total", label: "Total Complaints", bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-600" },
  { key: "pending", label: "Pending", bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-600" },
  { key: "in_progress", label: "In progress", bg: "bg-blue-150", border: "border-blue-850", text: "text-blue-900" },
  { key: "solved", label: "Solved", bg: "bg-green-50", border: "border-green-500", text: "text-green-600" },
  { key: "blockA", label: "Block A", bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-600" },
  { key: "blockB", label: "Block B", bg: "bg-blue-100", border: "border-blue-800", text: "text-blue-800" },
];

export default function ComplaintStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {STAT_CARDS.map((card) => (
        <div
          key={card.key}
          className={`p-5 rounded-lg ${card.bg} border-l-4 ${card.border} flex flex-col`}
        >
          <div className={`text-3xl font-bold ${card.text} mb-2`}>{stats[card.key] ?? 0}</div>
          <div className="text-gray-600">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
