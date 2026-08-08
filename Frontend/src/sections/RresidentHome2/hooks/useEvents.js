import { useCallback, useEffect, useState } from "react";
import { eventApi } from "../api/eventApi";

export function useEvents(enabled) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await eventApi.getAll();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, isLoading, error, refetch: loadEvents };
}
