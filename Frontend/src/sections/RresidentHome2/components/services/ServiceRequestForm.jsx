import React, { useState } from "react";
import ErrorBanner from "../common/ErrorBanner";

const SERVICE_TYPES = [
  "Water Can",
  "House Keeping",
  "Gas",
  "Plumbing",
  "Garbage Collection",
  "Other",
];

const INITIAL_FORM = {
  servicetype: "Water Can",
  additionalnote: "",
};

export default function ({ onSubmit }) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const requiredFields = ["servicetype"];
    const missingFields = requiredFields.filter(
      (field) => !formData[field]?.trim(),
    );
    if (missingFields.length > 0) {
      setFormError(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({ ...INITIAL_FORM });
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Submit Service Request</h2>
      <ErrorBanner message={formError} />
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label className="font-medium text-gray-700" htmlFor="serviceType">
            Select Service Type *
          </label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="serviceType"
            name="servicetype"
            value={formData.servicetype}
            onChange={handleChange}
            required
          >
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label
            className="font-medium text-gray-700"
            htmlFor="additionalNotes"
          >
            Additional Notes
          </label>
          <textarea
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="additionalNotes"
            name="additionalnote"
            placeholder="Any specific details"
            value={formData.additionalnote}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}
