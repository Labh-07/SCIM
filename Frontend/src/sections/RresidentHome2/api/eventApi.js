import axiosClient from "./axiosClient";

export const eventApi = {
  getAll: (society_id) => axiosClient.get(`/api/society/${society_id}/events`).then((res) => res.data),
  create: (society_id,event) =>
    axiosClient.post(`/api/society/${society_id}/events`, event).then((res) => res.data),
  update: (society_id ,event_id, event) =>
    axiosClient.patch(`/api/society/${society_id}/events/${event_id}`, event).then((res) => res.data),
  delete: (society_id , event_id) =>
    axiosClient.delete(`/api/society/${society_id}/events/${event_id}`).then((res) => res.data),
};
