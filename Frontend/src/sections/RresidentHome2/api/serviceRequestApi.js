import axiosClient from "./axiosClient";

export const serviceRequestApi = {
  getAll: (params) =>
    axiosClient
      .get("/service-requests/all-services", { params })
      .then((res) => res.data),
  create: (payload) =>
    axiosClient
      .post("/service-requests/add-services", payload)
      .then((res) => res.data),
};
