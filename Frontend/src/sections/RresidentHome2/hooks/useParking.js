import { useEffect, useState } from "react";
import { parkingApi } from "../api/parkingApi";

export function useParking() {
  const [parkingData, setParkingData] = useState([]);
  const [blocks, setBlocks] = useState(["A", "B", "C"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [parking, fetchedBlocks] = await Promise.all([
        parkingApi.getAll(),
        parkingApi.getBlocks(),
      ]);
      setParkingData(parking);
      if (fetchedBlocks?.length) {
        setBlocks(fetchedBlocks);
      } else {
        setBlocks([...new Set(parking.map((item) => item.block))]);
      }
    } catch (err) {
      console.error("Error loading parking data:", err);
      setError("Failed to load parking data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addParking = async (payload) => {
    const created = await parkingApi.create(payload);
    setParkingData((prev) => [...prev, created]);
  };

  const removeParking = async (id) => {
    await parkingApi.remove(id);
    setParkingData((prev) => prev.filter((item) => item._id !== id));
  };

  return { parkingData, blocks, isLoading, error, refetch: load, addParking, removeParking };
}
