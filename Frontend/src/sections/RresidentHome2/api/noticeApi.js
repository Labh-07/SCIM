import axiosClient from "./axiosClient";

export const noticeApi = {
  getAll: () => axiosClient.get("/notices").then((res) => res.data),
  create: (payload) =>
    axiosClient.post("/notices/add-notice", payload).then((res) => res.data),
};
