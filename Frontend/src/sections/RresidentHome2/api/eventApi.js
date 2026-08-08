import axiosClient from "./axiosClient";

export const eventApi = {
  getAll: () => axiosClient.get("/api/events").then((res) => res.data),
  create: (event) =>
    axiosClient.post("/api/events", event).then((res) => res.data),
  update: (id, event) =>
    axiosClient.put(`/api/events/${id}`, event).then((res) => res.data),
  remove: (id) =>
    axiosClient.delete(`/api/events/${id}`).then((res) => res.data),
};
