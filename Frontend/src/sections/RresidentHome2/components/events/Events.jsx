import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEvents } from "../../hooks/useEvents";
import EventDetailsModal from "./EventDetailsModal";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";

export default function Events() {
  const { events, isLoading, error } = useEvents(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {isLoading && <LoadingSpinner label="Loading events..." />}
      <ErrorBanner message={error} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Society Events</h2>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        editable={false}
        selectable={false}
        dayMaxEvents={true}
        weekends={true}
        eventClick={(clickInfo) => setSelectedEvent(clickInfo.event)}
        height="auto"
      />

      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
