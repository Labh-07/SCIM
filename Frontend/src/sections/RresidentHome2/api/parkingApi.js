import axiosClient from "./axiosClient";

export const parkingApi = {
  getAll: () => axiosClient.get("/api/parking").then((res) => res.data),
  getBlocks: () =>
    axiosClient.get("/api/parking/blocks").then((res) => res.data),
  create: (payload) =>
    axiosClient.post("/api/parking", payload).then((res) => res.data),
  remove: (id) =>
    axiosClient.delete(`/api/parking/${id}`).then((res) => res.data),
};
