import axiosClient from "./axiosClient";

export const authApi = {
  me: () => axiosClient.get("/api/auth/me").then((res) => res.data),
  logout: () => axiosClient.post("/api/auth/logout").then((res) => res.data),
};
