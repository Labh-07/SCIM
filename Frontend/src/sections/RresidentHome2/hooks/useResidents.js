import { useEffect, useState } from "react";
import { residentApi } from "../api/residentApi";
import { useAuth } from "../context/AuthContext";
import { ClockFading } from "lucide-react";

/**
 * Loads residents once and exposes client-side filtering by block + search term.
 */
export function useResidents() {
  const { userData ,isAdmin} = useAuth();

  const [residents, setResidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    residentname: "",
    block: "",
    flatno: "",
    mobileno: "",
  });

  const fetchResidents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await residentApi.getAll(userData?.societyid);
      const normalised = data.map((user) => ({
        ...user,
        residentname: user?.residentname || "",
        block: user?.block || "N/A",
        flatno: user?.flatno || "N/A",
        mobileno: user?.mobileno || "N/A",
      }));
      setResidents(normalised);
    } catch (err) {
      console.error("Error fetching residents:", err);
      setError("Failed to load residents. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (resident) => {
    // setCurrentResident(resident);
    setEditFormData({
      residentname: resident?.residentname || "",
      block: resident?.block || "",
      flatno: resident?.flatno || "",
      mobileno: resident?.mobileno || "",
    });
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log(userData)
    try {
      const data = await residentApi.updateResident(
        userData?.societyid,
        userData?.id,
        editFormData,
      );
      // Refresh residents after update
      console.log(data)
      fetchResidents();
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error updating resident:", err);
    }
  };

  useEffect(() => {
    if (userData?.societyid) {
      fetchResidents();
    }
  }, [userData]);

  return {
    isAdmin,
    handleEditClick,
    setEditModalOpen,
    editModalOpen,
    editFormData,
    handleEditFormChange,
    handleEditSubmit,
    userData,
    residents,
    isLoading,
    error,
    refetch: fetchResidents,
  };
}
