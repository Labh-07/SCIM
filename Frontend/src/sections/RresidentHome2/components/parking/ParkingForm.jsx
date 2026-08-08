import React, { useState } from "react";
import Modal from "../common/Modal";

const INITIAL_FORM = {
  parkingId: "",
  flatNo: "",
  block: "A",
  residentName: "",
  isOccupied: false,
};

export default function ParkingForm({ blocks, onSubmit, onClose }) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM, block: blocks[0] || "A" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Error adding parking space:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Add New Parking Space" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Parking ID</label>
          <input
            type="text"
            name="parkingId"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.parkingId}
            onChange={handleChange}
            required
            pattern="[P][-][A-Za-z][0-9]{3}"
            title="Format: P-A123"
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Block</label>
          <select
            name="block"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.block}
            onChange={handleChange}
            required
          >
            {blocks.map((block) => (
              <option key={block} value={block}>
                {block}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Flat Number</label>
          <input
            type="text"
            name="flatNo"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.flatNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Resident Name</label>
          <input
            type="text"
            name="residentName"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.residentName}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isOccupied"
            checked={formData.isOccupied}
            onChange={(e) => setFormData({ ...formData, isOccupied: e.target.checked })}
          />
          <label>Occupied</label>
        </div>
        <div className="flex justify-end gap-2">
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
            {isSubmitting ? "Adding..." : "Add Parking"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
