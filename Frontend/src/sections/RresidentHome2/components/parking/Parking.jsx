import React, { useMemo, useState } from "react";
import { Car, Search, BarChart2, Plus } from "lucide-react";
import { useParking } from "../../hooks/useParking";
import ParkingCard from "./ParkingCard";
import ParkingStats from "./ParkingStats";
import ParkingForm from "./ParkingForm";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";

// canManage=true enables the "Add Parking" action for admins; residents
// get a read-only view of occupancy.
export default function Parking({ canManage = false }) {
  const { parkingData, blocks, isLoading, error, addParking } = useParking();
  const [showStats, setShowStats] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("all");

  const stats = useMemo(() => {
    const result = {};
    blocks.forEach((block) => {
      const blockData = parkingData.filter((item) => item.block === block);
      const occupied = blockData.filter((item) => item.isOccupied).length;
      result[block] = {
        total: blockData.length,
        occupied,
        available: blockData.length - occupied,
        percentage: blockData.length ? Math.round((occupied / blockData.length) * 100) : 0,
      };
    });
    const occupiedAll = parkingData.filter((item) => item.isOccupied).length;
    result.all = {
      total: parkingData.length,
      occupied: occupiedAll,
      available: parkingData.length - occupiedAll,
      percentage: parkingData.length ? Math.round((occupiedAll / parkingData.length) * 100) : 0,
    };
    return result;
  }, [parkingData, blocks]);

  const filteredData = parkingData.filter((item) => {
    const matchesSearch =
      item.parkingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.residentName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === "all" || item.block === selectedBlock;
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Car size={22} /> Parking Management
        </h1>
        <div className="flex gap-2">
          {canManage && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={16} /> Add Parking
            </button>
          )}
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            <BarChart2 size={16} /> {showStats ? "Hide Stats" : "Show Stats"}
          </button>
        </div>
      </div>

      <ErrorBanner message={error} />
      {isLoading && <LoadingSpinner />}

      {showStats && <ParkingStats blocks={blocks} stats={stats} />}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID or resident..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
        >
          <option value="all">All Blocks</option>
          {blocks.map((block) => (
            <option key={block} value={block}>
              Block {block}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <ParkingCard key={item._id} item={item} />
        ))}
      </div>

      {showAddForm && (
        <ParkingForm blocks={blocks} onSubmit={addParking} onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}
