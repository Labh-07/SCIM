import React from "react";

export default function LogoutConfirm({ onConfirm, onCancel }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
      <h2 className="text-xl font-bold mb-6">Are you sure you want to logout?</h2>
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={onConfirm}
        >
          Yes, Logout
        </button>
        <button
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
