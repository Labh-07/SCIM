import React, { useState } from "react";
import Modal from "../common/Modal";

export default function PostForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({ title: "", caption: "", image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("caption", formData.caption);
      payload.append("image", formData.image);
      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Add New Post" onClose={onClose}>
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
          <label className="font-medium text-gray-700">Caption</label>
          <textarea
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            rows={3}
            required
          />
        </div>

        <div className="grid gap-2">
          <label className="font-medium text-gray-700">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-48 rounded object-cover"
            />
          )}
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
            {isSubmitting ? "Posting..." : "Add Post"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
