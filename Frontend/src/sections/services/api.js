// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Events API
const EVENTS_ENDPOINT = `${API_BASE_URL}/api/events`;

export const fetchEvents = async () => {
  try {
    const response = await axios.get(EVENTS_ENDPOINT);
    return response.data.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end || undefined,
      allDay: event.allDay,
      extendedProps: {
        description: event.description,
        imageUrl: event.imageUrl
      }
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const payload = {
      title: eventData.title,
      start: new Date(eventData.start).toISOString(),
      end: eventData.end ? new Date(eventData.end).toISOString() : null,
      description: eventData.description,
      allDay: eventData.allDay,
      imageUrl: eventData.imageUrl || null
    };
    
    const response = await axios.post(EVENTS_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await axios.put(`${EVENTS_ENDPOINT}/${id}`, {
      title: eventData.title,
      start: eventData.start,
      end: eventData.end || null,
      description: eventData.description,
      allDay: eventData.allDay,
      imageUrl: eventData.imageUrl || null
    });
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    await axios.delete(`${EVENTS_ENDPOINT}/${id}`);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Notices API
const NOTICES_ENDPOINT = `${API_BASE_URL}/notices`;

export const fetchNotices = async () => {
  try {
    const response = await axios.get(NOTICES_ENDPOINT);
    return response.data.map(notice => ({
      ...notice,
      scheduleAt: new Date(notice.scheduleAt)
    }));
  } catch (error) {
    console.error('Error fetching notices:', error);
    throw error;
  }
};

export const createNotice = async (noticeData) => {
  try {
    const response = await axios.post(`${NOTICES_ENDPOINT}/add-notice`, {
      title: noticeData.title,
      content: noticeData.content,
      scheduleAt: noticeData.scheduleAt.toISOString(),
      isImportant: noticeData.isImportant
    });
    return response.data;
  } catch (error) {
    console.error('Error creating notice:', error);
    throw error;
  }
};

export const updateNotice = async (id, noticeData) => {
  try {
    const response = await axios.put(`${NOTICES_ENDPOINT}/${id}`, {
      title: noticeData.title,
      content: noticeData.content,
      scheduleAt: noticeData.scheduleAt.toISOString(),
      isImportant: noticeData.isImportant
    });
    return response.data;
  } catch (error) {
    console.error('Error updating notice:', error);
    throw error;
  }
};

export const deleteNotice = async (id) => {
  try {
    await axios.delete(`${NOTICES_ENDPOINT}/${id}`);
  } catch (error) {
    console.error('Error deleting notice:', error);
    throw error;
  }
};