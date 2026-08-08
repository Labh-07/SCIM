import "./EventCalander.css";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


const Event = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({ title: "", date: "", description: "" });

    // Handle event click to show details
    const handleEventClick = (clickInfo) => {
      setSelectedEvent(clickInfo.event);
      setShowEventDetails(true);
    };

    // Handle date click to open form
    const handleDateClick = (arg) => {
      setFormData({ ...formData, date: arg.dateStr });
      setShowForm(true);
    };

    // Handle form input changes
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit event
    const handleSubmit = (e) => {
      e.preventDefault();
      setEvents([...events, { title: formData.title, start: formData.date, extendedProps: { description: formData.description } }]);
      setShowForm(false);
      setFormData({ title: "", date: "", description: "" });
    };

    return (
      <div className="container">
        <h1>Event Calendar</h1>
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
          />
        </div>

        {/* Add Event Button */}
        <button className="add-event-btn" onClick={() => setShowForm(true)}>+ Add Event</button>

        {/* Event Form Modal */}
        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add Event</h2>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />

                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />

                <button type="submit">Add Event</button>
                <button className="close-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Event Summary Modal */}
        {showEventDetails && selectedEvent && (
          <div className="modal">
            <div className="modal-content">
              <h2>Event Details</h2>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
              <p><strong>Date:</strong> {selectedEvent.start.toISOString().split("T")[0]}</p>
              <p><strong>Description:</strong> {selectedEvent.extendedProps?.description || "No description available"}</p>
              <button className="close-btn" onClick={() => setShowEventDetails(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    );
  };


export default Event
