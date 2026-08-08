import React, { useState } from "react";
import Modal from "../common/Modal";
import ErrorBanner from "../common/ErrorBanner";

const INITIAL_FORM = {
  title: "",
  startdt: "",
  enddt: "",
  description: "",
  allday: true,
};


export default function EventForm({ initialValues, isEditing, onSubmit, onDelete, onClose }) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM, ...initialValues });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setFormError(isEditing ? "Failed to update event" : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      setIsSubmitting(true);
      await onDelete();
      onClose();
    } catch (err) {
      setFormError("Failed to delete event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={isEditing ? "Edit Event" : "Add New Event"} onClose={onClose}>
      <ErrorBanner message={formError} />
      <form onSubmit={handleSubmit} className="grid gap-4">
      

        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Event Title</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Start Date</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="date"
            name="startdt"
            value={formData.startdt}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid gap-2">
          <label className="font-medium text-gray-700">End Date</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="date"
            name="enddt"
            value={formData.enddt}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allday"
            checked={formData.allday}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <label>All Day Event</label>
        </div>

        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Description</label>
          <textarea
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end gap-2">
          {isEditing && onDelete && (
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60 mr-auto"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          )}
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Event" : "Add Event"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
