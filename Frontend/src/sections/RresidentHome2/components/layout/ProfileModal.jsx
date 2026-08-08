import React from "react";
import Modal from "../common/Modal";

export default function ProfileModal({ userData,societyData, onClose }) {
  if (!userData) return null;
  const isAdmin = userData.role === "Admin";

  return (
    <Modal title={`Welcome, ${userData.residentname}!`} onClose={onClose}>
      <p className="mb-1">
        <span className="font-semibold">Email:</span> {userData.email}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Role:</span> {userData.role}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Phone:</span>{" "}
        {userData.mobileno || "Not provided"}
      </p>

      {isAdmin ? (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Admin Profile</h3>
          {societyData?.id && (
            <p className="mb-1">
              <span className="font-semibold">Society ID:</span>{" "}
              {societyData?.id}
            </p>
          )}
          {societyData?.societyname && (
            <p className="mb-1">
              <span className="font-semibold">Society Name:</span>{" "}
              {societyData?.societyname}
            </p>
          )}

          {societyData?.address && (
            <p className="mb-1">
              <span className="font-semibold">Society Address:</span>{" "}
              {societyData?.address}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Resident Profile</h3>
          {userData.flatno && (
            <p className="mb-1">
              <span className="font-semibold">Flat No:</span> {userData.flatno}
            </p>
          )}
          {userData.block && (
            <p className="mb-1">
              <span className="font-semibold">Block:</span> {userData.block}
            </p>
          )}
               {societyData.societyname && (
            <p className="mb-1">
              <span className="font-semibold">Society Name:</span>{" "}
              {societyData.societyname}
            </p>
          )}

          {societyData.address && (
            <p className="mb-1">
              <span className="font-semibold">Society Address:</span>{" "}
              {societyData.address}
            </p>
          )}
          
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors w-full"
      >
        Close
      </button>
    </Modal>
  );
}
