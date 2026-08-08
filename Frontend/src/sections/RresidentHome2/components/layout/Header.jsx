import React from "react";
import { User } from "lucide-react";

export default function Header({ title, userName, onProfileClick }) {
  return (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm w-full sticky top-0 z-10">
      <h1 className="text-xl font-bold">{title}</h1>
      <div
        className="flex items-center cursor-pointer"
        onClick={onProfileClick}
      >
        <span className="mr-4">{userName || "User"}</span>
        <User className="h-6 w-6" />
      </div>
    </div>
  );
}
