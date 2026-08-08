import axiosClient from "./axiosClient";

export const postApi = {
  getAll: () => axiosClient.get("/posts").then((res) => res.data),
  create: (formData) =>
    axiosClient
      .post("/posts/add-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),
};
