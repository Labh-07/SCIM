import { useCallback, useEffect, useState } from "react";
import { eventApi } from "../api/eventApi";
import { useAuth } from "../context/AuthContext";

export function useEvents(enabled) {
  const { userData, isAdmin } = useAuth();

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

const loadEvents = useCallback(async () => {
    if (!enabled || !userData?.societyid) return;

    setIsLoading(true);
    setError(null);

    try {
        const data = await eventApi.getAll(userData.societyid);

        console.log("EVENTS FROM BACKEND:", data);

        const calendarEvents = data.map((event) => {
            // ALL-DAY EVENT
            if (event.allday) {
                return {
                    id: event.id,
                    title: event.title,

                    // IMPORTANT:
                    // Keep only the date.
                    start: event.startdt.substring(0, 10),
                    end: event.enddt
                        ? event.enddt.substring(0, 10)
                        : undefined,

                    allDay: true,

                    extendedProps: {
                        description: event.description,
                    },
                };
            }

            // TIMED EVENT
            return {
                id: event.id,
                title: event.title,

                // Keep the UTC timestamp exactly as backend sent it
                start: event.startdt,
                end: event.enddt,

                allDay: false,

                extendedProps: {
                    description: event.description,
                },
            };
        });

        console.log("EVENTS FOR CALENDAR:", calendarEvents);

        setEvents(calendarEvents);

    } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
    } finally {
        setIsLoading(false);
    }
}, [enabled, userData?.societyid]);
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Admin-only mutations. All three refresh from the server afterwards so
  // the calendar always reflects what the backend actually saved.
  const createNewEvent = async (payload) => {
    setIsLoading(true);
    setError(null);
    payload={
      ...payload,
      societyid:userData?.societyid,
    }
    try {
      await eventApi.create(userData?.societyid,payload);
      await loadEvents();
    } catch (err) {
      setError("Failed to create event");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editEvent = async (id, payload) => {
    setIsLoading(true);
    setError(null);
    try {
      await eventApi.update(userData?.societyid,id, payload);
      await loadEvents();
    } catch (err) {
      setError("Failed to update event");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeEvent = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await eventApi.delete(userData?.societyid,id);
      await loadEvents();
    } catch (err) {
      setError("Failed to delete event");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAdmin,
    events,
    isLoading,
    error,
    refetch: loadEvents,
    createNewEvent,
    editEvent,
    removeEvent,
  };
}
