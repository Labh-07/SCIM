import React from "react";
import { Search } from "lucide-react";

const BLOCKS = ["A", "B"];

export default function ResidentSearchFilter({
  searchTerm,
  onSearchChange,
  activeBlock,
  onBlockChange,
}) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Apartments</h3>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search residents..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {BLOCKS.map((block) => (
            <button
              key={block}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeBlock === block
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => onBlockChange(block)}
            >
              Block {block}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
