import React, { useMemo, useState } from "react";
import { useResidents } from "../../hooks/useResidents";
import ResidentSearchFilter from "./ResidentSearchFilter";
import ResidentCard from "./ResidentCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";
import EmptyState from "../common/EmptyState";
import { residentApi } from "../../api/residentApi";

export default function ResidentsDashboard() {
  const {
    isAdmin,
    handleEditClick,
    setEditModalOpen,
    editModalOpen,
    editFormData,
    handleEditFormChange,
    handleEditSubmit,
    uaserData,
    residents,
    isLoading,
    error,
    refetch,
  } = useResidents();
  const [activeBlock, setActiveBlock] = useState("A");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResidents = useMemo(() => {
    let results = residents;
    if (activeBlock) {
      results = results.filter((resident) => resident.block === activeBlock);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter((resident) =>
        resident.residentname.toLowerCase().includes(term),
      );
    }
    return results;
  }, [residents, activeBlock, searchTerm]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Residents of the Society</h2>

          <ResidentSearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeBlock={activeBlock}
            onBlockChange={setActiveBlock}
          />

          <div className="mt-6">
            {isLoading ? (
              <LoadingSpinner label="Loading residents..." />
            ) : error ? (
              <ErrorBanner message={error} onRetry={refetch} />
            ) : filteredResidents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResidents.map((resident) => (
                  <ResidentCard
                    key={resident.id}
                    resident={resident}
                    isAdmin={isAdmin}
                    handleEditClick={()=>{handleEditClick(resident)}}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title={`No residents found in Block ${activeBlock}`}
              />
            )}
          </div>
        </div>

        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Edit Resident Details</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="residentname"
                    value={editFormData.residentname}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Block</label>
                  <input
                    type="text"
                    name="block"
                    value={editFormData.block}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Flat No</label>
                  <input
                    type="text"
                    name="flatno"
                    value={editFormData.flatno}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="mobileno"
                    value={editFormData.mobileno}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
