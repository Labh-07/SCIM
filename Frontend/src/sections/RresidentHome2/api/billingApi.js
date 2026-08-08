import axiosClient from "./axiosClient";

export const billingApi = {
  getBillsForResident: (residentId) =>
    axiosClient
      .get(`/api/bills/resident/${residentId}`)
      .then((res) => res.data),
  getPaymentHistory: (residentId) =>
    axiosClient
      .get(`/api/payments/resident/${residentId}`)
      .then((res) => res.data),
  payBill: (payload) =>
    axiosClient.post("/api/bills/pay", payload).then((res) => res.data),
};
