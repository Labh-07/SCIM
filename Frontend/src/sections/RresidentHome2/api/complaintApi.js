import axiosClient from "./axiosClient";

export const complaintApi = {
  getAll: (societyid) =>
    axiosClient
      .get(`/api/society/${societyid}/complaints`)
      .then((res) => res.data),
  getStats: (societyid) =>
    axiosClient
      .get(`/api/society/${societyid}/complaints/stats`)
      .then((res) => res.data),
  create: (payload, societyid) =>
    axiosClient
      .post(`/api/society/${societyid}/complaints`, payload)
      .then((res) => res.data),
  updateComplaint: (societyid, complaintid, status, comment) =>
    axiosClient
      .patch(`/api/society/${societyid}/complaints/${complaintid}`, {
        status,
        comment,
      })
      .then((res) => res.data),
  deleteComplaint: (societyid, complaintid) =>
    axiosClient
      .delete(`/api/society/${societyid}/complaints/${complaintid}`)
      .then((res) => res.data),
};
