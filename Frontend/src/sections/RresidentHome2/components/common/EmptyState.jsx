import React from "react";

export default function EmptyState({ title, subtitle }) {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>{title}</p>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
