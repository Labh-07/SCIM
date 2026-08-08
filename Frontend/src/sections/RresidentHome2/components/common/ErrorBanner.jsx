import React from "react";

export default function ErrorBanner({ message, onRetry, retryLabel = "Retry" }) {
  if (!message) return null;
  return (
    <div className="bg-red-100 text-red-600 p-4 rounded-md text-center mb-4">
      {message}
      {onRetry && (
        <button onClick={onRetry} className="ml-2 underline">
          {retryLabel}
        </button>
      )}
    </div>
  );
}
