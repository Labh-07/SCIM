import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import Modal from "../common/Modal";

const INITIAL_FORM = {
  title: "",
  content: "",
  important: false,
};

export default function NoticeForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Error creating notice:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Add New Notice" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Content</label>
          <textarea
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={5}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="important"
            checked={formData.important}
            onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
          />
          <label htmlFor="important">Mark as important</label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Notice"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
