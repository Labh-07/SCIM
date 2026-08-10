import axiosClient from "./axiosClient";

export const serviceRequestApi = {
  getAll: (societyid) =>
    axiosClient
      .get(`/api/society/${societyid}/services`)
      .then((res) => res.data),
  getStats: (societyid) =>
    axiosClient
      .get(`/api/society/${societyid}/services/stats`)
      .then((res) => res.data),
  create: (societyid,payload) =>
    axiosClient
      .post(`/api/society/${societyid}/services`, payload)
      .then((res) => res.data),
  updateService: (societyid, serviceid, status, comment) =>
    axiosClient
      .patch(`/api/society/${societyid}/services/${serviceid}`, {
        status,
        comment,
      })
      .then((res) => res.data),
  deleteComplaint: (societyid, serviceid) =>
    axiosClient
      .delete(`/api/society/${societyid}/services/${serviceid}`)
      .then((res) => res.data),
};
