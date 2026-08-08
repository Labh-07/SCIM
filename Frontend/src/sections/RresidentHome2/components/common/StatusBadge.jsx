import React from "react";

const TONE_MAP = {
  amber: "bg-amber-100 text-amber-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
};

/**
 * Small pill badge. Pass a `tone` directly, or a status string via
 * `statusToneMap` (e.g. { Pending: "amber", Approved: "green" }).
 */
export default function StatusBadge({ status, tone }) {
  const resolvedTone = tone || "blue";
  return (
    <span
      className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
        TONE_MAP[resolvedTone] || TONE_MAP.blue
      }`}
    >
      {status}
    </span>
  );
}
