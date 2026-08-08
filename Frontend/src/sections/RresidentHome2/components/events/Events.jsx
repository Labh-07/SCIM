import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Plus } from "lucide-react";
import { useEvents } from "../../hooks/useEvents";
import EventDetailsModal from "./EventDetailsModal";
import EventForm from "./EventForm";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";


export default function Events() {
  const {
    isAdmin,
    events,
    isLoading,
    error,
    createNewEvent,
    editEvent,
    removeEvent,
  } = useEvents(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState(null);

  const openCreateForm = (dateStr) => {
    setSelectedEvent(null);
    setFormInitialValues({
      title: "",
      startdt: dateStr || new Date().toISOString().split("T")[0],
      enddt: "",
      description: "",
      allday: true,
    });
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setFormInitialValues({
      title: event.title,
      startdt: event.startStr?.split("T")[0] || "",
      enddt: event.endStr?.split("T")[0] || "",
      description: event.extendedProps?.description || "",
      allday: event.allDay,
    });

    setShowDetails(false);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    await removeEvent(selectedEvent.id);
    setShowDetails(false);
    setSelectedEvent(null);
  };

const handleEventChange = async (changeInfo) => {
    try {
        const event = changeInfo.event;

        await editEvent(event.id, {
            title: event.title,

            startdt: event.allDay
                ? event.startStr
                : event.start?.toISOString(),

            enddt: event.allDay
                ? event.endStr
                : event.end?.toISOString() || null,

            description: event.extendedProps?.description || "",

            allday: event.allDay,
        });

    } catch (err) {
        changeInfo.revert();
    }
};

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {isLoading && <LoadingSpinner label="Loading events..." />}
      <ErrorBanner message={error} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Society Events</h2>
        {isAdmin && (
          <button
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => openCreateForm()}
          >
            <Plus size={16} /> Add Event
          </button>
        )}
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
        editable={isAdmin}
        selectable={isAdmin}
        selectMirror={isAdmin}
        dayMaxEvents={true}
        weekends={true}
        dateClick={isAdmin ? (arg) => openCreateForm(arg.dateStr) : undefined}
        eventClick={(clickInfo) => {
          setSelectedEvent(clickInfo.event);
          setShowDetails(true);
        }}
        eventChange={isAdmin ? handleEventChange : undefined}
        height="auto"
      />

      {showDetails && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowDetails(false)}
          onEdit={isAdmin ? () => openEditForm(selectedEvent) : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
        />
      )}

      {showForm && (
        <EventForm
          initialValues={formInitialValues}
          isEditing={!!selectedEvent}
          onSubmit={(payload) =>
            selectedEvent
              ? editEvent(selectedEvent.id, payload)
              : createNewEvent(payload)
          }
          onDelete={selectedEvent ? handleDelete : undefined}
          onClose={() => {
            setShowForm(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}
