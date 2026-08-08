import React from "react";
import {
  Cog,
  AlertCircle,
  Calendar,
  Bell,
  Pen,
  ParkingSquare,
  Phone,
  FileText,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import NavItem from "./NavItem";
import logo from "../../assets/Natural Care Logo.jpg";

// Single source of truth for the nav — add/remove a section here and
// both the sidebar and the section title logic stay in sync.
export const NAV_SECTIONS = [
  { id: "dashboard-section", title: "Dashboard", icon: <LayoutDashboard /> },
  { id: "request-services-section", title: "Request Services", icon: <Cog /> },
  { id: "complaints-section", title: "Complaints", icon: <AlertCircle /> },
  { id: "events-section", title: "Events", icon: <Calendar /> },
  { id: "notices-section", title: "Notices", icon: <Bell /> },
  { id: "posts-section", title: "Posts", icon: <Pen /> },
  //upcoming section
  // { id: "parking-section", title: "Parking", icon: <ParkingSquare /> },
  // { id: "emergency-contacts-section", title: "Emergency Contacts", icon: <Phone /> },
  // { id: "billings-section", title: "Billings", icon: <FileText /> },
  { id: "logout-section", title: "Logout", icon: <LogOut /> },
];

export default function Sidebar({ activeSection, onNavClick }) {
  return (
    <div className="w-64 min-w-[16rem] bg-white h-screen shadow-sm flex-shrink-0 overflow-y-auto border-r border-gray-200 z-10 fixed md:relative">
      <div className="flex items-center justify-center py-7 border-b border-gray-200">
        <img src={logo || "/placeholder.svg"} alt="Logo" className="h-12" />
      </div>
      <nav className="py-6">
        {NAV_SECTIONS.map((section) => (
          <NavItem
            key={section.id}
            icon={section.icon}
            title={section.title}
            isActive={activeSection === section.id}
            onClick={() => onNavClick(section.id)}
          />
        ))}
      </nav>
    </div>
  );
}
