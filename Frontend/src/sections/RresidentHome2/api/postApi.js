import axiosClient from "./axiosClient";

export const postApi = {
  getAll: (society_id) => axiosClient.get(`/api/society/${society_id}/posts`).then((res) => res.data),
  create: (society_id,formData) =>
    axiosClient
      .post(`/api/society/${society_id}/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),
    delete:(society_id,postId) =>
      axiosClient.delete(`/api/society/${society_id}/posts/${postId}`).then((res)=>res.data),
};
