import React from "react";

export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex justify-center py-8 text-blue-600">{label}</div>
  );
}
