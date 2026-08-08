import React, { useState } from "react";
import ErrorBanner from "../common/ErrorBanner";

const SERVICE_TYPES = [
  "Water Can",
  "House Keeping",
  "Gas",
  "Plumbing",
  "Garbage Collection",
];

const INITIAL_FORM = {
  serviceType: "Water Can",
  name: "",
  address: "",
  phoneNo: "",
  additionalNotes: "",
};

export default function ServiceRequestForm({ defaultName, onSubmit }) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM, name: defaultName || "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const requiredFields = ["serviceType", "name", "address", "phoneNo"];
    const missingFields = requiredFields.filter((field) => !formData[field]?.trim());
    if (missingFields.length > 0) {
      setFormError(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }
    if (!/^\d{10}$/.test(formData.phoneNo)) {
      setFormError("Phone number must be 10 digits");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({ ...INITIAL_FORM, name: defaultName || "" });
    } catch (err) {
      setFormError(
        err.response?.data?.message || err.message || "Failed to submit request."
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
            name="serviceType"
            value={formData.serviceType}
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
          <label className="font-medium text-gray-700" htmlFor="name">
            Your Name *
          </label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="name"
            name="name"
            placeholder="Enter your name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <label className="font-medium text-gray-700" htmlFor="address">
            Address *
          </label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="address"
            name="address"
            placeholder="Enter your Address here"
            type="text"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <label className="font-medium text-gray-700" htmlFor="phoneNo">
            Phone Number *
          </label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="phoneNo"
            name="phoneNo"
            placeholder="Enter your phone number"
            type="tel"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Please enter a 10-digit phone number"
          />
        </div>

        <div className="grid gap-2">
          <label className="font-medium text-gray-700" htmlFor="additionalNotes">
            Additional Notes
          </label>
          <textarea
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="additionalNotes"
            name="additionalNotes"
            placeholder="Any specific details"
            value={formData.additionalNotes}
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
