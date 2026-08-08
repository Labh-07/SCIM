import axiosClient from "./axiosClient";

export const complaintApi = {
  getAll: () => axiosClient.get("/api/complaints").then((res) => res.data),
  getStats: () =>
    axiosClient.get("/api/complaints/stats").then((res) => res.data),
  create: (payload) =>
    axiosClient.post("/api/complaints", payload).then((res) => res.data),
  updateStatus: (id, status) =>
    axiosClient
      .patch(`/api/complaints/${id}/status`, { status })
      .then((res) => res.data),
};
