import axiosClient from "./axiosClient";

export const residentApi = {
  getAll: (society_id) =>
    axiosClient.get(`/api/society/${society_id}/residents`).then((res) => res.data),
  updateResident: (society_id ,resident_id, updatedData)=>
    axiosClient.patch(`/api/society/${society_id}/resident/${resident_id}`,updatedData).then((res) => res.data),
};
