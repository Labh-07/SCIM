import axiosClient from "./axiosClient";

export const noticeApi = {
  getAll: (societyid) => axiosClient.get(`/api/society/${societyid}/notices`).then((res) => res.data),
  create: (societyid , payload) =>
    axiosClient.post(`/api/society/${societyid}/notices`, payload).then((res) => res.data),
  delete:(societyid,noticeid) => 
    axiosClient.delete(`/api/society/${societyid}/notice/${noticeid}`).then((res) => res.data),
};
