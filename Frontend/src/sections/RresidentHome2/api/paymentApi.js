import axiosClient from "./axiosClient";

export const paymentApi = {
  createOrder: (payload) =>
    axiosClient
      .post("/api/payments/create-order", payload)
      .then((res) => res.data),
  verify: (payload) =>
    axiosClient.post("/api/payments/verify", payload).then((res) => res.data),
};
