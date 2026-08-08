import React from "react";

// Static for now — swap for an API call once the backend exposes an
// emergency-contacts endpoint.
const CONTACTS = [
  { name: "Fire Department", phone: "101", bg: "bg-red-50", border: "border-red-500" },
  { name: "Police", phone: "100", bg: "bg-blue-50", border: "border-blue-500" },
  { name: "Ambulance", phone: "102", bg: "bg-green-50", border: "border-green-500" },
  { name: "Society Security", phone: "9876543210", bg: "bg-amber-50", border: "border-amber-500" },
  { name: "Maintenance", phone: "9876543211", bg: "bg-purple-50", border: "border-purple-500" },
];

export default function EmergencyContacts() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Emergency Contacts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONTACTS.map((contact) => (
          <div key={contact.name} className={`p-4 rounded-lg border-l-4 ${contact.bg} ${contact.border}`}>
            <h3 className="font-semibold mb-2">{contact.name}</h3>
            <p>Phone: {contact.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
