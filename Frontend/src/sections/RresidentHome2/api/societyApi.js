import axiosClient from "./axiosClient";

export const societyApi = {
  getSocietyInfo: (society_id) => axiosClient.get(`/api/society/${society_id}`).then((res) => res.data),
  getSocietyInsights: (society_id) => axiosClient.get(`/api/society/${society_id}/insights`).then((res) => res.data),
};
