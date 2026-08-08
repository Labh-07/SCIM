import React from "react";
import Modal from "../common/Modal";

export default function EventDetailsModal({ event, onClose }) {
  if (!event) return null;

  return (
    <Modal title={event.title} onClose={onClose}>
      {event.extendedProps?.imageUrl && (
        <div className="mb-4">
          <img
            src={event.extendedProps.imageUrl || "/placeholder.svg"}
            alt={event.title}
            className="max-w-full max-h-48 rounded object-cover mx-auto"
          />
        </div>
      )}

      <p className="mb-2">
        <span className="font-semibold">Date:</span>{" "}
        {new Date(event.start).toLocaleDateString()}
        {event.end && ` to ${new Date(event.end).toLocaleDateString()}`}
      </p>
      {event.extendedProps?.description && (
        <p className="mb-6">
          <span className="font-semibold">Description:</span>{" "}
          {event.extendedProps.description}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
