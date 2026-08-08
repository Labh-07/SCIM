import React from "react";
import Modal from "../common/Modal";

// `onEdit`/`onDelete` are only passed by the admin calendar — residents
// get a read-only details popup with just a Close button.
export default function EventDetailsModal({ event, onClose, onEdit, onDelete }) {
  if (!event) return null;

  return (
    <Modal title={event.title} onClose={onClose}>
    

      <p className="mb-2">
        <span className="font-semibold">Date:</span>{" "}
        {new Date(event.startdt).toLocaleDateString()}
        {event.enddt && ` to ${new Date(event.enddt).toLocaleDateString()}`}
      </p>
      {event.extendedProps?.description && (
        <p className="mb-6">
          <span className="font-semibold">Description:</span>{" "}
          {event.extendedProps.description}
        </p>
      )}

      <div className="flex justify-end gap-2">
        {onDelete && (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mr-auto"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
        {onEdit && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
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
