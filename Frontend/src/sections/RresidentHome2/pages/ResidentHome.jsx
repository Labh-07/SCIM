import React, { useEffect, useState } from "react";
import Sidebar, { NAV_SECTIONS } from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ProfileModal from "../components/layout/ProfileModal";
import LogoutConfirm from "../components/layout/LogoutConfirm";
import ResidentsDashboard from "../components/dashboard/ResidentsDashboard";
import RequestServices from "../components/services/RequestServices";
import Complaints from "../components/complaints/Complaints";
import Events from "../components/events/Events";
import Notices from "../components/notices/Notices";
import Posts from "../components/posts/Posts";
import Parking from "../components/parking/Parking";
import EmergencyContacts from "../components/emergency/EmergencyContacts";
import Billing from "../components/billing/Billing";
import { useAuth } from "../context/AuthContext";

const SECTION_TITLES = NAV_SECTIONS.reduce((map, section) => {
  map[section.id] = section.title;
  return map;
}, {});

// Maps each nav section id to the component that renders it. Adding a
// new sidebar item only requires an entry in NAV_SECTIONS (Sidebar.jsx)
// and here.
const SECTION_COMPONENTS = {
  "dashboard-section": ResidentsDashboard,
  "request-services-section": RequestServices,
  "complaints-section": Complaints,
  "events-section": Events,
  "notices-section": Notices,
  "posts-section": Posts,
  //upcoming feature :
  // "parking-section": Parking,
  // "emergency-contacts-section": EmergencyContacts,
  // "billings-section": Billing,
};

export default function ResidentHome() {
  const {fetchUserData, userData, societyData , logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard-section");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleNavClick = (sectionId) => setActiveSection(sectionId);

  const ActiveSectionComponent = SECTION_COMPONENTS[activeSection];
  const sectionTitle =
    activeSection === "dashboard-section"
      ? "Residents of the society"
      : SECTION_TITLES[activeSection] || "Dashboard";

  useEffect(()=>{
    fetchUserData();
  },[])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      <Sidebar activeSection={activeSection} onNavClick={handleNavClick} />

      <div className="flex-1 overflow-y-auto w-full ml-0 md:ml-0">
        <div className="p-6 w-full max-w-full">
          <Header
            title={sectionTitle}
            userName={userData?.username}
            onProfileClick={() => setIsProfileOpen(true)}
          />

          {activeSection === "logout-section" ? (
            <LogoutConfirm
              onConfirm={logout}
              onCancel={() => setActiveSection("dashboard-section")}
            />
          ) : ActiveSectionComponent ? (
            <ActiveSectionComponent />
          ) : null}
        </div>
      </div>

      {isProfileOpen && userData && (
        <ProfileModal userData={userData} societyData={societyData} onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  );
}
