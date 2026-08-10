import React, { useState } from "react";
import ErrorBanner from "../common/ErrorBanner";

export default function ComplaintForm ({ onSubmit }) {
  const [formData, setFormData] = useState({
    residentname: "",
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title || !formData.description) {
      setFormError("Title and description are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ ...formData, status: "pending" });
      setFormData((prev) => ({ ...prev, title: "", description: "" }));
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Submit Complaint</h2>
      <ErrorBanner message={formError} />
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label className="font-medium text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="name"
            name="residentname"
            placeholder="Enter your Name here"
            type="text"
            value={formData.residentname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium text-gray-700" htmlFor="title">
            Title *
          </label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="title"
            name="title"
            placeholder="Enter the Title here"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium text-gray-700" htmlFor="description">
            Description *
          </label>
          <textarea
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="description"
            name="description"
            placeholder="Enter the Description here"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
