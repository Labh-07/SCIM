import React from "react";

export default function NavItem({ icon, title, isActive, onClick }) {
  return (
    <button
      className={`flex items-center gap-3 px-6 py-3 w-full text-left transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{title}</span>
    </button>
  );
}
